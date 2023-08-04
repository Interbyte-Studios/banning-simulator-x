import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { MarketplaceService, Players, RunService, Workspace } from "@rbxts/services";
import {
	getAutoFightCache,
	getFocusedNPC,
	getManualAutoFightState,
	setAutoFightCache,
	setFocusedNPC,
	setPurchasedAutoFight,
} from "client/modules/autoFightCache";
import { toggleAutoFight } from "client/modules/autoFightWalkspeedHandler";
import { getIsTrading } from "client/modules/isTradingCache";
import {
	uiClaimButtonStrokeColor,
	uiDarkStrokeColor,
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
import { Currency } from "shared/configs/currencies";
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

let lastTimerCheck = 0;

const NPC_ATTACK_DEBOUNCE = 1.5;
let lastNPCAttackCheck = 0;

const npcsFolder = Workspace.WaitForChild("npcs") as Folder;

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

			const currentCache = getAutoFightCache();

			setAutoFightCache({ ...currentCache, bans: currentCache.bans + 1 });
		}, [isEnabled, props.bans]);

		useEffect(() => {
			if (!isEnabled) {
				return;
			}

			const currentCache = getAutoFightCache();
			if (currentCache.bans >= 2) {
				return;
			}

			setAutoFightCache({
				...currentCache,
				obtainedCurrency: currentCache.obtainedCurrency.map((currency) => {
					return {
						...currency,
						amount: props.currencies[currency.name],
					};
				}),
			});
		}, [isEnabled, props.currencies]);

		useEffect(() => {
			const connection = RunService.Heartbeat.Connect(() => {
				debug.profilebegin("Auto Fight Timer");
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
				debug.profileend();
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
				addAnnouncement(`You don't own the zone you're enabling auto fight in!`, AnnouncementType.Error);
				setIsEnabled(false);
				return;
			}

			const randomObject = new Random();
			const connection = RunService.Heartbeat.Connect(() => {
				debug.profilebegin("Auto Fight Movement");
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

				const focusedNpc = getFocusedNPC();

				if (focusedNpc !== undefined && focusedNpc.Health > 0) {
					const root = focusedNpc.RootPart;
					if (root === undefined) {
						return;
					}

					if (humanoidRootPart.Position.sub(root.Position).Magnitude > 4) {
						const direction = root.Position.sub(humanoidRootPart.Position).Unit;
						const targetPosition = root.Position.sub(direction.mul(2));
						humanoid.MoveTo(targetPosition);
					}
					return;
				} else {
					setFocusedNPC(undefined);
				}

				const now = time();
				if (now - lastNPCAttackCheck < NPC_ATTACK_DEBOUNCE) {
					return;
				}
				lastNPCAttackCheck = now;

				if (storedZoneData === undefined) {
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
				const targetPosition = npcRootPart.Position.sub(direction.mul(2));
				humanoid.MoveTo(targetPosition);

				setFocusedNPC(npcHumanoid);
				debug.profileend();
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

			const currentCache = getAutoFightCache();
			setAutoFightCache({
				obtainedCurrency: currentCache.obtainedCurrency.map((currency) => {
					return { name: currency.name, amount: 0 };
				}),
				bans: 0,
			});
			setFocusedNPC(undefined);
		}, [isEnabled, props.currencies, props.rank, props.currentWeapon]);

		useEffect(() => {
			if (!isEnabled) {
				return;
			}

			const connection = npcsFolder.ChildRemoved.Connect((npcCharacter) => {
				const focusedNpc = getFocusedNPC();
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

				if (!props.gamepasses["Auto Fight"]) {
					task.delay(1, (): void => {
						if (focusedNpc === humanoid) {
							setFocusedNPC(undefined);
						}
					});
				} else {
					if (focusedNpc === humanoid) {
						setFocusedNPC(undefined);
					}
				}
			});

			return (): void => connection.Disconnect();
		}, [isEnabled, props.boosts, props.gamepasses, props.bans]);

		useEffect(() => {
			if (!props.gamepasses["Auto Fight"]) {
				toggleAutoFight(isEnabled, props.walkspeed);
			}
			setPurchasedAutoFight(isEnabled);
		}, [isEnabled, props.walkspeed, props.gamepasses]);

		if (!isEnabled) {
			return (
				<ImageLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.825),
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
		} else {
			const currencyAmount = getAutoFightCache().obtainedCurrency.find((currency) => currency.name === farmingCurrency);

			const advertisement: Array<Roact.Element> = [];
			if (!props.gamepasses["Auto Fight"]) {
				const element = (
					<BaseFrame
						BackgroundTransparency={0}
						BackgroundColor3={uiTextStrokeColor}
						Position={UDim2.fromScale(0.5, -0.35)}
						Size={UDim2.fromScale(1, 0.5)}
					>
						<uicorner CornerRadius={new UDim(0.2, 0)} />
						<BaseUIStroke
							native={{
								Thickness: 2,
								Color: uiDarkStrokeColor,
							}}
						/>

						<SpringImageButton
							native={{
								Position: UDim2.fromScale(0.85, 0.5),
								Image: assetIds.images.ui.index.Claim,
							}}
							size={{ minSize: 0.6, maxSize: 0.7 }}
							events={{
								/**
								 * Prompts user to purchase Auto Fight.
								 *
								 * @returns Void.
								 */
								Activated: (): void =>
									MarketplaceService.PromptGamePassPurchase(Players.LocalPlayer, GAMEPASSES["Auto Fight"]),
							}}
						>
							<uiaspectratioconstraint AspectRatio={2} />
							<StrokeTextLabel
								native={{
									Text: "R$499",
									Position: UDim2.fromScale(0.5, 0.5),
									Size: UDim2.fromScale(0.8, 0.8),
								}}
								stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
							/>
						</SpringImageButton>

						<ImageLabel
							native={{
								Position: UDim2.fromScale(0.1, 0.5),
								Size: UDim2.fromScale(1, 1),
								Image: assetIds.images.decals.gamepasses["Auto Fight"],
							}}
						>
							<uiaspectratioconstraint AspectRatio={1} />
						</ImageLabel>
						<StrokeTextLabel
							native={{
								Text: "Purchase the gamepass to fight much faster!",
								Position: UDim2.fromScale(0.45, 0.5),
								Size: UDim2.fromScale(0.55, 0.8),
							}}
							stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
						/>
					</BaseFrame>
				);

				advertisement.push(element);
			}

			return (
				<ImageLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.825),
						Size: UDim2.fromScale(0.35, 0.4),
						Image: assetIds.images.ui.autoFight.minimized,
					}}
				>
					<uiaspectratioconstraint AspectRatio={3.2} />

					{advertisement}

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
							Text: tostring(getAutoFightCache().bans),
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
								if (getIsTrading()) {
									return;
								}

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
