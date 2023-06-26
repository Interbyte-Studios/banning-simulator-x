import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { MarketplaceService, Players, RunService, Workspace } from "@rbxts/services";
import { getManualAutoFightState, setPurchasedAutoFight } from "client/modules/autoFightCache";
import { toggleAutoFight } from "client/modules/autoFightWalkspeedHandler";
import {
	uiClaimButtonStrokeColor,
	uiDarkStrokeColor,
	uiHeaderStrokeColor,
	uiOffButtonStrokeColor,
	uiTextStrokeColor,
} from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { hooks } from "client/ui/hooks";
import { formatTime } from "client/util/formatTime";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { currencies, Currency } from "shared/configs/currencies";
import { GAMEPASSES } from "shared/configs/game";
import { isValidZone, UniversalWorldData, Zone, ZoneNames } from "shared/configs/zones";
import { StoreState } from "shared/rodux";
import { BansState } from "shared/rodux/bans";
import { BoostsState } from "shared/rodux/boosts";
import { CurrenciesState } from "shared/rodux/currencies";
import { CurrentWeaponState } from "shared/rodux/currentWeapon";
import { ExperienceState } from "shared/rodux/experience";
import { GamepassesState } from "shared/rodux/gamepasses";
import { RankState } from "shared/rodux/rank";
import { WorldsState } from "shared/rodux/worlds";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";

interface AutoFightCache {
	obtainedCurrency: Array<{ name: Currency; amount: number }>;
	bans: number;
}

let lastTimerCheck = 0;

const NPC_ATTACK_DEBOUNCE = 1.5;
let lastNPCAttackCheck = 0;
let focusedNpc: Humanoid | undefined;

const npcsFolder = Workspace.WaitForChild("npcs") as Folder;

const autoFightCache: AutoFightCache = {
	obtainedCurrency: currencies.map((value) => {
		return { name: value, amount: 0 };
	}),
	bans: 0,
};

interface AutoFightProps extends AutoFightMappedProps {
	hideMenu: () => void;
}

interface AutoFightMappedProps {
	gamepasses: GamepassesState;
	worlds: WorldsState;
	rank: RankState;
	currentWeapon: CurrentWeaponState;
	experience: ExperienceState;
	currencies: CurrenciesState;
	bans: BansState;
	boosts: BoostsState;
	walkspeed: number;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): AutoFightMappedProps {
	return {
		gamepasses: state.gamepasses,
		worlds: state.worlds,
		rank: state.rank,
		currentWeapon: state.currentWeapon,
		experience: state.experience,
		currencies: state.currencies,
		walkspeed: state.settings.gameplay.walkSpeed,
		bans: state.bans,
		boosts: state.boosts,
	};
}

/**
 * A marketed component allowing the player to auto fight NPCs in any zone they'd like.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const AutoFight = RoactRodux.connect(mapStateToProps)(
	hooks((props: AutoFightProps, hooks) => {
		const { useState, useEffect, useContext, useValue } = hooks;
		const [isEnabled, setIsEnabled] = useState(false);
		const [zoneSelected, setSelectedZone] = useState<ZoneNames | undefined>(undefined);
		const [timeElapsed, setTimeElapsed] = useState(0);
		const [farmingCurrency, setFarmingCurrency] = useState<Currency>("coins");

		const { addAnnouncement } = useContext(AnnouncementContext);

		const mounted = useValue(false);
		useEffect(() => {
			mounted.value = true;

			return (): void => {
				mounted.value = false;
			};
		}, []);

		useEffect(() => {
			if (!isEnabled) {
				return;
			}

			autoFightCache.bans += 1;
		}, [isEnabled, props.bans]);

		useEffect(() => {
			if (!isEnabled) {
				return;
			}

			if (autoFightCache.bans >= 2) {
				return;
			}

			autoFightCache.obtainedCurrency.forEach((currency) => {
				currency.amount = props.currencies[currency.name];
			});
		}, [isEnabled, props.currencies]);

		useEffect(() => {
			const connection = RunService.Heartbeat.Connect(() => {
				if (!mounted) {
					return;
				}

				if (!isEnabled) {
					return;
				}

				const now = time();
				if (now - lastTimerCheck < 1) {
					return;
				}
				lastTimerCheck = now;

				setTimeElapsed(timeElapsed + 1);
			});

			return (): void => connection.Disconnect();
		}, [isEnabled, timeElapsed]);

		useEffect(() => {
			if (!isEnabled) {
				return;
			}

			if (zoneSelected === undefined) {
				warn(`No zone could be found for enabling auto fight. Disabling for component safety (E-1).`);
				setIsEnabled(false);
				return;
			}

			let storedZoneData: Zone | undefined;
			for (const worldData of props.worlds) {
				const zoneIsOwned = worldData.zones.find((zoneName) => zoneName === zoneSelected);
				if (zoneIsOwned === undefined) {
					continue;
				}

				for (const [, worldData] of pairs(UniversalWorldData)) {
					for (const [zoneName, zoneData] of pairs(worldData)) {
						if (zoneName !== zoneSelected) {
							continue;
						}

						if (zoneData.cost !== undefined && farmingCurrency !== zoneData.cost.currency) {
							setFarmingCurrency(zoneData.cost.currency);
						}

						storedZoneData = zoneData;
						break;
					}
				}
			}

			if (storedZoneData === undefined) {
				warn(
					`The zone selected for auto fight: "${zoneSelected}" is not owned by the local player. Disabling for component safety (E-2).`,
				);
				addAnnouncement(`You don't own the zone you're enabling auto fight in!`, AnnouncementType.Error);
				setIsEnabled(false);
				return;
			}

			const randomObject = new Random();
			const connection = RunService.Heartbeat.Connect(() => {
				if (!mounted) {
					return;
				}

				const character = Players.LocalPlayer.Character;
				if (character === undefined) {
					return;
				}

				const humanoid = character.FindFirstChildOfClass("Humanoid");
				if (humanoid === undefined) {
					return;
				}

				const humanoidRootPart = humanoid.RootPart;
				if (humanoidRootPart === undefined) {
					return;
				}

				if (focusedNpc !== undefined && focusedNpc.Health > 0) {
					const root = focusedNpc.RootPart;
					if (root === undefined) {
						return;
					}

					if (humanoidRootPart.Position.sub(root.Position).Magnitude > 4) {
						const direction = root.Position.sub(humanoidRootPart.Position).Unit;
						const targetPosition = root.Position.sub(direction.mul(3));
						humanoid.MoveTo(targetPosition);
					}
					return;
				} else {
					focusedNpc = undefined;
				}

				const now = time();
				if (now - lastNPCAttackCheck < NPC_ATTACK_DEBOUNCE) {
					return;
				}
				lastNPCAttackCheck = now;

				if (storedZoneData === undefined) {
					warn(
						`Selected zone state for auto fight has been marked as undefined while operation is running. This is a problem!`,
					);
					addAnnouncement(`There's been an issue while auto fighting. Try again later.`, AnnouncementType.Error);
					setIsEnabled(false);
					return;
				}

				const randomNumber = randomObject.NextInteger(1, 2);
				const isBoss = randomNumber === 2;

				// find closest NPC and attack it
				const zoneNPC = storedZoneData.npcs.find((npcData) => (isBoss ? npcData.isBoss : !npcData.isBoss));
				if (zoneNPC === undefined) {
					return;
				}

				let npcToAttack: Instance | undefined;
				for (const npc of npcsFolder.GetChildren()) {
					if (npc.Name !== zoneNPC.name) {
						continue;
					}

					if (npcToAttack === undefined) {
						npcToAttack = npc;
						continue;
					}

					const humanoid = npc.FindFirstChild("Humanoid") as Humanoid;
					if (humanoid === undefined) {
						continue;
					}

					const rootPart = humanoid.RootPart;
					if (rootPart === undefined) {
						continue;
					}

					const magnitudeFromCharacter = humanoidRootPart.Position.sub(rootPart.Position).Magnitude;

					const previousNPCHumanoid = npcToAttack.FindFirstChild("Humanoid") as Humanoid;
					if (previousNPCHumanoid === undefined) {
						npcToAttack = npc;
						continue;
					}

					const previousNPCRootPart = previousNPCHumanoid.RootPart;
					if (previousNPCRootPart === undefined) {
						npcToAttack = npc;
						continue;
					}

					const previousNPCMagnitudeFromCharacter = humanoidRootPart.Position.sub(
						previousNPCRootPart.Position,
					).Magnitude;

					if (magnitudeFromCharacter < previousNPCMagnitudeFromCharacter) {
						npcToAttack = npc;
					}
				}

				if (npcToAttack === undefined) {
					return;
				}

				const npcHumanoid = npcToAttack.FindFirstChildOfClass("Humanoid");
				if (npcHumanoid === undefined) {
					return;
				}

				const npcRootPart = npcHumanoid.RootPart;
				if (npcRootPart === undefined) {
					return;
				}

				const direction = npcRootPart.Position.sub(humanoidRootPart.Position).Unit;
				const targetPosition = npcRootPart.Position.sub(direction.mul(3));
				humanoid.MoveTo(targetPosition);

				focusedNpc = npcHumanoid;
			});

			return (): void => connection.Disconnect();
		}, [isEnabled, zoneSelected, props.worlds]);

		useEffect(() => {
			if (!isEnabled) {
				return;
			}

			const localPlayer = Players.LocalPlayer;

			let lastSwingTime = 0;
			const connection = RunService.RenderStepped.Connect(() => {
				debug.profilebegin("Auto Fight");
				const now = time();
				if (now - lastSwingTime < 0.5) {
					return;
				}
				lastSwingTime = now;

				const character = localPlayer.Character;
				if (character === undefined) {
					return;
				}

				const weapon = character.FindFirstChildOfClass("Tool");
				if (weapon === undefined) {
					return;
				}

				weapon.Activate();
				debug.profileend();
			});

			return (): void => connection.Disconnect();
		}, [isEnabled]);

		useEffect(() => {
			if (isEnabled) {
				return;
			}

			autoFightCache.obtainedCurrency.forEach((currencyData) => {
				currencyData.amount = 0;
			});
			autoFightCache.bans = 0;

			focusedNpc = undefined;
		}, [isEnabled, props.currencies, props.rank, props.currentWeapon]);

		useEffect(() => {
			if (!isEnabled) {
				return;
			}

			const connection = npcsFolder.ChildRemoved.Connect((npcCharacter) => {
				if (focusedNpc === undefined) {
					return;
				}

				if (!npcCharacter.IsA("Model")) {
					return;
				}

				if (npcCharacter.Name !== focusedNpc.Parent?.Name) {
					return;
				}

				const humanoid = npcCharacter.FindFirstChildOfClass("Humanoid");
				if (humanoid === undefined) {
					return;
				}

				if (focusedNpc === humanoid) {
					focusedNpc = undefined;
				}
			});

			return (): void => connection.Disconnect();
		}, [isEnabled, props.boosts, props.bans]);

		useEffect(() => {
			toggleAutoFight(isEnabled, props.walkspeed);
			setPurchasedAutoFight(isEnabled);
		}, [isEnabled, props.walkspeed]);

		if (!isEnabled) {
			if (!props.gamepasses["Auto Fight"]) {
				return (
					<ImageLabel
						native={{
							Size: UDim2.fromScale(0.5, 0.675),
							Image: assetIds.images.ui.teleportation.background,
						}}
					>
						<uiaspectratioconstraint AspectRatio={1.163} />

						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, 0.063),
								Size: UDim2.fromScale(0.425, 0.11),
								Text: "Auto Fight",
							}}
							stroke={{ native: { Thickness: 2, Color: uiHeaderStrokeColor } }}
						/>

						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, 0.2),
								Size: UDim2.fromScale(0.85, 0.11),
								Text: "You do not own Auto Fight!",
							}}
							stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
						/>

						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, 0.35),
								Size: UDim2.fromScale(0.85, 0.11),
								Text: "You can unlock Auto Fight by purchasing the gamepass:",
							}}
							stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
						/>

						<BaseFrame
							BackgroundTransparency={0}
							BackgroundColor3={Color3.fromRGB(13, 147, 230)}
							Position={UDim2.fromScale(0.5, 0.45)}
							Size={UDim2.fromScale(0.6, 0.175)}
						>
							<uicorner CornerRadius={new UDim(0.15, 0)} />
							<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />

							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.4, 0.5),
									Size: UDim2.fromScale(0.2, 0.4),
									Text: "R$699",
									TextColor3: Color3.fromRGB(85, 255, 127),
								}}
								stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
							/>

							<SpringImageButton
								native={{
									Position: UDim2.fromScale(0.8, 0.5),
									Image: assetIds.images.ui.index.Claim,
								}}
								size={{ minSize: 0.6, maxSize: 0.7 }}
								events={{
									/* eslint-disable jsdoc/require-jsdoc */
									Activated: (): void => {
										playSFX(UIEngagement.MinorEngagement);
										MarketplaceService.PromptProductPurchase(Players.LocalPlayer, GAMEPASSES["Auto Fight"]);
									},
									/* eslint-enable jsdoc/require-jsdoc */
								}}
							>
								<uiaspectratioconstraint AspectRatio={2} />

								<StrokeTextLabel
									native={{
										Size: UDim2.fromScale(0.8, 0.8),
										Text: "Buy",
									}}
									stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(41, 120, 31) } }}
								/>
							</SpringImageButton>

							<BaseFrame // todo: Convert to image label of auto fight gamepass
								BackgroundColor3={Color3.fromRGB(14, 165, 253)}
								Position={UDim2.fromScale(0.135, 0.5)}
								Size={UDim2.fromScale(0.9, 0.9)}
							>
								<uiaspectratioconstraint AspectRatio={1} />
								<uicorner CornerRadius={new UDim(1, 0)} />
								<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />
							</BaseFrame>
						</BaseFrame>

						<ExitButton
							Position={UDim2.fromScale(0.975, 0.125)}
							minimizedSize={0.085}
							maximizedSize={0.1}
							onClosed={(): void => props.hideMenu()}
						/>
					</ImageLabel>
				);
			} else {
				return (
					<ImageLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.75),
							Size: UDim2.fromScale(0.35, 0.4),
							Image: assetIds.images.ui.autoFight.minimized,
						}}
					>
						<uiaspectratioconstraint AspectRatio={3.2} />

						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, 0.4),
								Size: UDim2.fromScale(0.9, 0.3),
								Text: "Auto fight is not enabled.",
							}}
							stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
						/>

						<SpringImageButton
							native={{
								Position: UDim2.fromScale(0.5, 0.9),
								Image: assetIds.images.ui.index.Claim,
							}}
							size={{ minSize: 0.35, maxSize: 0.4 }}
							events={{
								/* eslint-disable jsdoc/require-jsdoc */
								Activated: (): void => {
									playSFX(UIEngagement.MinorEngagement);

									const character = Players.LocalPlayer.Character;
									if (character === undefined) {
										addAnnouncement("There was an issue while enabling auto fight (E-1).", AnnouncementType.Error);
										return;
									}

									const humanoid = character.FindFirstChildOfClass("Humanoid");
									if (humanoid === undefined) {
										addAnnouncement("There was an issue while enabling auto fight (E-2).", AnnouncementType.Error);
										return;
									}

									const humanoidRootPart = humanoid.RootPart;
									if (humanoidRootPart === undefined) {
										addAnnouncement("There was an issue while enabling auto fight (E-3).", AnnouncementType.Error);
										return;
									}

									const raycastParams = new RaycastParams();
									raycastParams.FilterDescendantsInstances = [Workspace.worlds["Ban Land"].zones];
									raycastParams.FilterType = Enum.RaycastFilterType.Whitelist;
									raycastParams.IgnoreWater = false;

									const raycastResult = Workspace.Raycast(
										humanoidRootPart.Position,
										new Vector3(0, -100, 0),
										raycastParams,
									);

									if (raycastResult === undefined) {
										addAnnouncement("Please enter the zone you wish to auto fight in.", AnnouncementType.Error);
										return;
									}

									if (raycastResult.Instance.Name !== "floor") {
										addAnnouncement("There was an issue while enabling auto fight (E-5).", AnnouncementType.Error);
										return;
									}

									const landingFolder = raycastResult.Instance.Parent;
									if (landingFolder === undefined) {
										addAnnouncement("There was an issue while enabling auto fight (E-6).", AnnouncementType.Error);
										return;
									}

									if (!isValidZone(landingFolder.Name)) {
										addAnnouncement("There was an issue while enabling auto fight (E-8).", AnnouncementType.Error);
										return;
									}

									if (getManualAutoFightState()) {
										addAnnouncement("You're already fighting an NPC. Try again later.", AnnouncementType.Error);
										return;
									}
									setSelectedZone(landingFolder.Name);
									setIsEnabled(true);
								},
								/* eslint-enable jsdoc/require-jsdoc */
							}}
						>
							<StrokeTextLabel
								native={{
									Size: UDim2.fromScale(0.85, 0.85),
									Text: "Start",
								}}
								stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
							/>
						</SpringImageButton>

						<ExitButton
							Position={UDim2.fromScale(0.975, 0.05)}
							minimizedSize={0.25}
							maximizedSize={0.3}
							onClosed={(): void => props.hideMenu()}
						/>
					</ImageLabel>
				);
			}
		} else {
			const currencyAmount = autoFightCache.obtainedCurrency.find((currency) => currency.name === farmingCurrency);

			return (
				<ImageLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.75),
						Size: UDim2.fromScale(0.35, 0.4),
						Image: assetIds.images.ui.autoFight.minimized,
					}}
				>
					<uiaspectratioconstraint AspectRatio={3.2} />

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.15),
							Size: UDim2.fromScale(0.9, 0.2),
							Text: `Auto Fight has been active for: ${formatTime(timeElapsed)}`,
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.335),
							Size: UDim2.fromScale(0.975, 0.15),
							Text: "(Make sure to interact every 20 minutes so you don't get kicked!)",
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.34, 0.65),
							Size: UDim2.fromScale(0.215, 0.3),
							Text:
								currencyAmount !== undefined
									? statsAbbreviator.numberToString(props.currencies[currencyAmount.name] - currencyAmount.amount)
									: "",
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{
							native: { Thickness: 2, Color: Color3.fromRGB(255, 255, 255) },
							currencyGradient: currencyAmount !== undefined ? currencyAmount.name : "coins",
						}}
					>
						<CurrencyIcon
							position={UDim2.fromScale(-0.25, 0.5)}
							size={UDim2.fromScale(1, 1)}
							currency={currencyAmount !== undefined ? currencyAmount.name : "coins"}
						/>
					</StrokeTextLabel>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.8, 0.65),
							Size: UDim2.fromScale(0.215, 0.3),
							Text: tostring(autoFightCache.bans),
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{
							native: { Thickness: 2, Color: uiTextStrokeColor },
						}}
					>
						<ImageLabel
							native={{
								Position: UDim2.fromScale(-0.25, 0.5),
								Size: UDim2.fromScale(1, 1),
								Image: assetIds.images.vectors.Hammer,
							}}
						/>
					</StrokeTextLabel>

					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.5, 1.05),
							Image: assetIds.images.ui.index.Off,
						}}
						size={{ minSize: 0.35, maxSize: 0.4 }}
						events={{
							/* eslint-disable jsdoc/require-jsdoc */
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								setIsEnabled(false);
							},
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />
						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.51, 0.5),
								Size: UDim2.fromScale(0.9, 0.9),
								Text: "Disable",
							}}
							stroke={{ native: { Thickness: 1.5, Color: uiOffButtonStrokeColor } }}
						/>
					</SpringImageButton>
				</ImageLabel>
			);
		}
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
