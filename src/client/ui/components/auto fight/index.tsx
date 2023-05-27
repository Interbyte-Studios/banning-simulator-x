import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { MarketplaceService, Players, ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { getManualAutoFightState, setPurchasedAutoFight } from "client/modules/autoFightCache";
import { toggleAutoFight } from "client/modules/autoFightWalkspeedHandler";
import { uiClaimButtonStrokeColor, uiDarkStrokeColor, uiHeaderStrokeColor, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { RankIcon } from "client/ui/elements/icons/rankIcon";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { formatTime } from "client/util/formatTime";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { currencies, Currency } from "shared/configs/currencies";
import { GAMEPASSES } from "shared/configs/game";
import { MAX_RANK, RANKS } from "shared/configs/ranks";
import { MAX_WEAPON_ID } from "shared/configs/weapons";
import { isValidZone, UniversalWorldData, Zone, ZoneNames } from "shared/configs/zones";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { CurrentWeaponState } from "shared/rodux/currentWeapon";
import { ExperienceState } from "shared/rodux/experience";
import { GamepassesState } from "shared/rodux/gamepasses";
import { RankState } from "shared/rodux/rank";
import { WorldsState } from "shared/rodux/worlds";
import { getWeaponInfo } from "shared/util/getWeaponInfo";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

interface AutoFightCache {
	obtainedCurrency: Array<{ name: Currency; amount: number }>;
	startingRank: number;
	startingWeapon: number;
	petExperience: number;
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
	startingRank: 1,
	startingWeapon: 1,
	petExperience: 0,
};

interface AutoFightProps extends AutoFightMappedProps {
	enabled: boolean;
	hideMenu: () => void;
}

interface AutoFightMappedProps {
	gamepasses: GamepassesState;
	worlds: WorldsState;
	rank: RankState;
	currentWeapon: CurrentWeaponState;
	experience: ExperienceState;
	currencies: CurrenciesState;
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
		const [autoRankEnabled, setAutoRankEnabled] = useState(false);
		const [purchaseWeaponsEnabled, setPurchaseWeaponsEnabled] = useState(false);
		const [viewingRewards, setViewingRewards] = useState(false);

		const { unlockRank, purchaseWeapon } = useContext(remoteContext);
		const { addAnnouncement } = useContext(AnnouncementContext);

		const mounted = useValue(false);
		useEffect(() => {
			mounted.value = true;

			return (): void => {
				mounted.value = false;
			};
		}, []);

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

			if (!autoRankEnabled) {
				return;
			}

			if (props.rank === MAX_RANK) {
				return;
			}

			const nextRankData = RANKS.find((rankData) => rankData.id === props.rank + 1);
			if (nextRankData === undefined) {
				return;
			}

			if (props.experience < nextRankData.requiredExperience) {
				return;
			}

			if (props.currencies[nextRankData.cost.currency] < nextRankData.cost.amount) {
				return;
			}

			unlockRank.SendToServer();
		}, [props.experience, props.currencies, isEnabled, autoRankEnabled, unlockRank]);

		useEffect(() => {
			if (!isEnabled) {
				return;
			}

			if (!purchaseWeaponsEnabled) {
				return;
			}

			const nextWeaponId = props.currentWeapon.id + 1;
			if (nextWeaponId > MAX_WEAPON_ID) {
				return;
			}

			const nextWeapon = getWeaponInfo(props.currentWeapon.id + 1);
			if (nextWeapon.data.cost === undefined) {
				return;
			}

			if (nextWeapon.data.cost.requiredRank !== undefined) {
				if (props.rank < nextWeapon.data.cost.requiredRank) {
					return;
				}
			}

			if (props.currencies[nextWeapon.data.cost.currency] < nextWeapon.data.cost.amount) {
				return;
			}

			purchaseWeapon.SendToServer(nextWeapon.data.id);
		}, [props.currencies, props.rank, isEnabled, purchaseWeaponsEnabled, purchaseWeapon, props.currentWeapon.id]);

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

				// find NPC to attack, if not within a 215 stud distance (magnitude), then teleport to it.
				const zoneNPC = storedZoneData.npcs.find((npcData) => (isBoss ? npcData.isBoss : !npcData.isBoss));
				if (zoneNPC === undefined) {
					return;
				}

				const npcToAttack = npcsFolder.FindFirstChild(zoneNPC.name);
				if (npcToAttack === undefined) {
					return;
				}

				const now = time();
				if (now - lastNPCAttackCheck < NPC_ATTACK_DEBOUNCE) {
					return;
				}
				lastNPCAttackCheck = now;

				const npcHumanoid = npcToAttack.FindFirstChildOfClass("Humanoid");
				if (npcHumanoid === undefined) {
					return;
				}

				const npcRootPart = npcHumanoid.RootPart;
				if (npcRootPart === undefined) {
					return;
				}

				if (humanoidRootPart.Position.sub(npcRootPart.Position).Magnitude > 215) {
					humanoidRootPart.PivotTo(npcRootPart.CFrame);
				} else {
					const direction = npcRootPart.Position.sub(humanoidRootPart.Position).Unit;
					const targetPosition = npcRootPart.Position.sub(direction.mul(3));
					humanoid.MoveTo(targetPosition);
				}

				focusedNpc = npcHumanoid;
			});

			return (): void => connection.Disconnect();
		}, [isEnabled, zoneSelected,  props.worlds]);

		useEffect(() => {
			if (!isEnabled) {
				return;
			}

			const localPlayer = Players.LocalPlayer;

			let lastSwingTime = 0;
			const connection = RunService.RenderStepped.Connect(() => {
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
			autoFightCache.startingRank = props.rank;
			autoFightCache.startingWeapon = props.currentWeapon.id;
			autoFightCache.petExperience = 0;

			focusedNpc = undefined;
		}, [isEnabled, props.currencies, props.rank, props.currentWeapon]);

		useEffect(() => {
			if (!isEnabled) {
				return;
			}

			const connection = npcsFolder.ChildRemoved.Connect((npcCharacter) => {
				if (focusedNpc === undefined) {
					return warn("Focused was undefined.");
				}

				if (!npcCharacter.IsA("Model")) {
					return;
				}

				if (npcCharacter.Name !== focusedNpc.Parent?.Name) {
					return warn("Names didn't match.");
				}

				const humanoid = npcCharacter.FindFirstChildOfClass("Humanoid");
				if (humanoid === undefined) {
					return;
				}

				if (focusedNpc === humanoid) {
					for (const [, worldData] of pairs(UniversalWorldData)) {
						for (const [, zoneData] of pairs(worldData)) {
							const npcData = zoneData.npcs.find((npcData) => npcData.name === npcCharacter.Name);
							if (npcData === undefined) {
								continue;
							}

							const cachedCurrency = autoFightCache.obtainedCurrency.find(
								(currencyData) => currencyData.name === npcData.reward.currencyType,
							);
							if (cachedCurrency === undefined) {
								continue;
							}

							if (ReplicatedStorage.events.currency.enabled.Value) {
								if (ReplicatedStorage.events.currency.multiplier.Value > 2) {
									cachedCurrency.amount += npcData.reward.currency * ReplicatedStorage.events.currency.multiplier.Value;
								}
							} else {
								cachedCurrency.amount += npcData.reward.currency;
							}
						}
					}

					focusedNpc = undefined;
				}
			});

			return (): void => connection.Disconnect();
		}, [isEnabled]);

		useEffect(() => toggleAutoFight(isEnabled, props.walkspeed), [isEnabled, props.walkspeed]);

		if (!props.enabled) {
			return <></>;
		}

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

									setPurchasedAutoFight(true);

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
			if (!viewingRewards) {
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

						<ImageLabel
							native={{
								Position: UDim2.fromScale(0.25, 0.65),
								Size: UDim2.fromScale(0.475, 0.3),
								Image: assetIds.images.ui.settings["setting background"],
							}}
						>
							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.35, 0.5),
									Size: UDim2.fromScale(0.6, 0.8),
									TextXAlignment: Enum.TextXAlignment.Left,
									Text: "Buy Weapons",
								}}
								stroke={{ native: { Thickness: 2 } }}
							/>

							<SpringImageButton
								native={{
									Position: UDim2.fromScale(0.85, 0.5),
									Image: purchaseWeaponsEnabled ? assetIds.images.ui.index.Claim : assetIds.images.ui.index.Off,
								}}
								size={{ minSize: 0.55, maxSize: 0.6 }}
								events={{
									// eslint-disable-next-line jsdoc/require-jsdoc
									Activated: (): void => {
										playSFX(UIEngagement.MinorEngagement);
										setPurchaseWeaponsEnabled(!purchaseWeaponsEnabled);
									},
								}}
							>
								<uiaspectratioconstraint AspectRatio={2} />
								<StrokeTextLabel
									native={{
										Size: UDim2.fromScale(0.9, 0.9),
										Text: purchaseWeaponsEnabled ? "On" : "Off",
									}}
									stroke={{
										native: {
											Thickness: 1.5,
											Color: purchaseWeaponsEnabled ? Color3.fromRGB(36, 159, 66) : Color3.fromRGB(106, 14, 46),
										},
									}}
								/>
							</SpringImageButton>
						</ImageLabel>

						<ImageLabel
							native={{
								Position: UDim2.fromScale(0.75, 0.65),
								Size: UDim2.fromScale(0.475, 0.3),
								Image: assetIds.images.ui.settings["setting background"],
							}}
						>
							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.35, 0.5),
									Size: UDim2.fromScale(0.6, 0.8),
									TextXAlignment: Enum.TextXAlignment.Left,
									Text: "Buy Ranks",
								}}
								stroke={{ native: { Thickness: 2 } }}
							/>

							<SpringImageButton
								native={{
									Position: UDim2.fromScale(0.85, 0.5),
									Image: autoRankEnabled ? assetIds.images.ui.index.Claim : assetIds.images.ui.index.Off,
								}}
								size={{ minSize: 0.55, maxSize: 0.6 }}
								events={{
									// eslint-disable-next-line jsdoc/require-jsdoc
									Activated: (): void => {
										playSFX(UIEngagement.MinorEngagement);
										setAutoRankEnabled(!autoRankEnabled);
									},
								}}
							>
								<uiaspectratioconstraint AspectRatio={2} />
								<StrokeTextLabel
									native={{
										Size: UDim2.fromScale(0.9, 0.9),
										Text: autoRankEnabled ? "On" : "Off",
									}}
									stroke={{
										native: {
											Thickness: 1.5,
											Color: autoRankEnabled ? Color3.fromRGB(36, 159, 66) : Color3.fromRGB(106, 14, 46),
										},
									}}
								/>
							</SpringImageButton>
						</ImageLabel>

						<SpringImageButton
							native={{
								Position: UDim2.fromScale(0.5, 1.05),
								Image: assetIds.images.ui.index.Claim,
							}}
							size={{ minSize: 0.35, maxSize: 0.4 }}
							events={{
								/* eslint-disable jsdoc/require-jsdoc */
								Activated: (): void => {
									playSFX(UIEngagement.MinorEngagement);
									setViewingRewards(true);
								},
							}}
						>
							<uiaspectratioconstraint AspectRatio={2} />
							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.51, 0.5),
									Size: UDim2.fromScale(0.9, 0.9),
									Text: "Rewards",
								}}
								stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(43, 150, 61) } }}
							/>
						</SpringImageButton>
					</ImageLabel>
				);
			} else {
				const cachedWeaponData = getWeaponInfo(autoFightCache.startingWeapon);
				const storedWeaponData = getWeaponInfo(props.currentWeapon.id);

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
							stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(165, 90, 7) } }}
						/>

						<scrollingframe
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							ScrollBarThickness={0}
							ScrollingDirection={Enum.ScrollingDirection.Y}
							Position={UDim2.fromScale(0.5, 0.555)}
							Size={UDim2.fromScale(0.95, 0.825)}
							CanvasSize={UDim2.fromScale(0, 1.14)}
						>
							<uilistlayout Padding={new UDim(0.02, 0)} />

							{autoFightCache.obtainedCurrency.map((currencyData) => {
								return (
									<BaseFrame
										BackgroundTransparency={0}
										BackgroundColor3={Color3.fromRGB(26, 116, 172)}
										Size={UDim2.fromScale(1, 0.12)}
									>
										<uicorner CornerRadius={new UDim(0.3, 0)} />
										<CurrencyIcon
											anchorPoint={vec2Middle}
											position={UDim2.fromScale(0.075, 0.5)}
											size={{ minimizedSize: 0.8, maximizedSize: 0.9 }}
											currency={currencyData.name}
										/>

										<StrokeTextLabel
											native={{
												Position: UDim2.fromScale(0.4, 0.5),
												Size: UDim2.fromScale(0.5, 0.8),
												Text: `${
													currencyData.name === "coins" ? "Coins" : currencyData.name === "gems" ? "Gems" : "Currency"
												} Earned ${
													ReplicatedStorage.events.currency.enabled.Value &&
													ReplicatedStorage.events.currency.multiplier.Value > 2
														? "(event)"
														: ""
												}:`,
												TextXAlignment: Enum.TextXAlignment.Left,
											}}
											stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
										/>

										<StrokeTextLabel
											native={{
												Position: UDim2.fromScale(0.825, 0.5),
												Size: UDim2.fromScale(0.3, 0.7),
												Text: twoDpAbbreviator.numberToString(currencyData.amount),
												TextXAlignment: Enum.TextXAlignment.Right,
											}}
											stroke={{
												native: { Thickness: 1.5, Color: Color3.fromRGB(255, 255, 255) },
												currencyGradient: currencyData.name,
											}}
										/>
									</BaseFrame>
								);
							})}

							<BaseFrame
								BackgroundTransparency={0}
								BackgroundColor3={Color3.fromRGB(26, 116, 172)}
								Size={UDim2.fromScale(1, 0.12)}
							>
								<uicorner CornerRadius={new UDim(0.3, 0)} />
								<StrokeTextLabel
									native={{
										Position: UDim2.fromScale(0.265, 0.5),
										Size: UDim2.fromScale(0.5, 0.8),
										Text: "Starting Rank:",
										TextXAlignment: Enum.TextXAlignment.Left,
									}}
									stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
								/>
								<RankIcon
									rank={autoFightCache.startingRank}
									position={UDim2.fromScale(0.925, 0.5)}
									size={{ minimizedSize: 0.8, maximizedSize: 0.9 }}
								/>
							</BaseFrame>

							<BaseFrame
								BackgroundTransparency={0}
								BackgroundColor3={Color3.fromRGB(26, 116, 172)}
								Size={UDim2.fromScale(1, 0.12)}
							>
								<uicorner CornerRadius={new UDim(0.3, 0)} />
								<StrokeTextLabel
									native={{
										Position: UDim2.fromScale(0.265, 0.5),
										Size: UDim2.fromScale(0.5, 0.8),
										Text: "Ending Rank:",
										TextXAlignment: Enum.TextXAlignment.Left,
									}}
									stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
								/>
								<RankIcon
									rank={props.rank}
									position={UDim2.fromScale(0.925, 0.5)}
									size={{ minimizedSize: 0.8, maximizedSize: 0.9 }}
								/>
							</BaseFrame>

							<BaseFrame
								BackgroundTransparency={0}
								BackgroundColor3={Color3.fromRGB(26, 116, 172)}
								Size={UDim2.fromScale(1, 0.12)}
							>
								<uicorner CornerRadius={new UDim(0.3, 0)} />
								<StrokeTextLabel
									native={{
										Position: UDim2.fromScale(0.265, 0.5),
										Size: UDim2.fromScale(0.5, 0.8),
										Text: "Starting Weapon:",
										TextXAlignment: Enum.TextXAlignment.Left,
									}}
									stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
								/>
								<StrokeTextLabel
									native={{
										Position: UDim2.fromScale(0.825, 0.5),
										Size: UDim2.fromScale(0.3, 0.7),
										Text: cachedWeaponData.name,
										TextXAlignment: Enum.TextXAlignment.Right,
									}}
									stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
								/>
							</BaseFrame>

							<BaseFrame
								BackgroundTransparency={0}
								BackgroundColor3={Color3.fromRGB(26, 116, 172)}
								Size={UDim2.fromScale(1, 0.12)}
							>
								<uicorner CornerRadius={new UDim(0.3, 0)} />
								<StrokeTextLabel
									native={{
										Position: UDim2.fromScale(0.265, 0.5),
										Size: UDim2.fromScale(0.5, 0.8),
										Text: "Ending Weapon:",
										TextXAlignment: Enum.TextXAlignment.Left,
									}}
									stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
								/>
								<StrokeTextLabel
									native={{
										Position: UDim2.fromScale(0.825, 0.5),
										Size: UDim2.fromScale(0.3, 0.7),
										Text: storedWeaponData.name,
										TextXAlignment: Enum.TextXAlignment.Right,
									}}
									stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
								/>
							</BaseFrame>
						</scrollingframe>

						<SpringImageButton
							native={{
								Position: UDim2.fromScale(0.7, 1.1),
								Image: assetIds.images.ui.index.Claim,
							}}
							size={{ minSize: 0.2, maxSize: 0.25 }}
							events={{
								/* eslint-disable jsdoc/require-jsdoc */
								Activated: (): void => {
									playSFX(UIEngagement.MinorEngagement);
									setViewingRewards(false);
								},
							}}
						>
							<uiaspectratioconstraint AspectRatio={2} />

							<StrokeTextLabel
								native={{
									Size: UDim2.fromScale(0.9, 0.9),
									Text: "Continue",
								}}
								stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(43, 150, 61) } }}
							/>
						</SpringImageButton>

						<SpringImageButton
							native={{
								Position: UDim2.fromScale(0.3, 1.1),
								Image: assetIds.images.ui.index.Off,
							}}
							size={{ minSize: 0.2, maxSize: 0.25 }}
							events={{
								/* eslint-disable jsdoc/require-jsdoc */
								Activated: (): void => {
									playSFX(UIEngagement.MinorEngagement);

									setPurchasedAutoFight(false);

									setTimeElapsed(0);
									setViewingRewards(false);
									setIsEnabled(false);
								},
							}}
						>
							<uiaspectratioconstraint AspectRatio={2} />

							<StrokeTextLabel
								native={{
									Size: UDim2.fromScale(0.9, 0.9),
									Text: "Disable",
								}}
								stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(150, 43, 43) } }}
							/>
						</SpringImageButton>
					</ImageLabel>
				);
			}
		}
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
