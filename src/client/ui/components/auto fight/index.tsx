import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players, RunService, Workspace } from "@rbxts/services";
import { toggleAutoFight } from "client/modules/autoFightWalkspeedHandler";
import { font, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { CurrencyIcon } from "client/ui/elements/currencyIcon";
import { ExitButton } from "client/ui/elements/exitButton";
import { RankIcon } from "client/ui/elements/rankIcon";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { formatTime } from "client/util/formatTime";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { currencies, Currency } from "shared/configs/currencies";
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
		if (!props.enabled) {
			return <></>;
		}

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
		}, [props.experience, props.currencies]);

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
		}, [props.currencies, props.rank]);

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
						humanoid.MoveTo(root.Position);
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
					humanoid.MoveTo(npcRootPart.Position);
				}

				focusedNpc = npcHumanoid;
			});

			return (): void => connection.Disconnect();
		}, [isEnabled, props.worlds]);

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

							cachedCurrency.amount += npcData.reward.currency;
						}
					}

					focusedNpc = undefined;
				}
			});

			return (): void => connection.Disconnect();
		}, [isEnabled]);

		useEffect(() => toggleAutoFight(isEnabled, props.walkspeed), [isEnabled, props.walkspeed]);

		if (!isEnabled) {
			// todo: Add case for if they do not own the gamepass or have it unlocked through mastery
			if (!props.gamepasses.Teleportation) {
				const minimizedSize = 0.6;
				const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

				const maximizedSize = 0.7;
				const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

				const { motor, binding } = useBindingMotor(hooks, maximizedSize);

				return (
					<imagelabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.5, 0.675)}
						Image={assetIds.images.ui.teleportation.background}
						ScaleType={Enum.ScaleType.Fit}
					>
						<uiaspectratioconstraint AspectRatio={1.163} />

						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.063)}
							Size={UDim2.fromScale(0.425, 0.11)}
							Font={font}
							Text={`Auto Fight`}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
						>
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(165, 90, 7) }} />
						</textlabel>
						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.2)}
							Size={UDim2.fromScale(0.85, 0.11)}
							Font={font}
							Text={`You do not own Auto Fight!`}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
						>
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 79, 130) }} />
						</textlabel>

						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.35)}
							Size={UDim2.fromScale(0.85, 0.11)}
							Font={font}
							Text={`You can unlock auto fight for free through account mastery:`}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
						>
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 79, 130) }} />
						</textlabel>
						<frame
							AnchorPoint={vec2Middle}
							BackgroundTransparency={0}
							BackgroundColor3={Color3.fromRGB(13, 147, 230)}
							Position={UDim2.fromScale(0.5, 0.51)}
							Size={UDim2.fromScale(0.9, 0.175)}
						>
							<uicorner CornerRadius={new UDim(0.15, 0)} />
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 79, 130) }} />

							<textlabel
								AnchorPoint={vec2Middle}
								BackgroundTransparency={1}
								Position={UDim2.fromScale(0.6, 0.5)}
								Size={UDim2.fromScale(0.75, 0.6)}
								Font={font}
								Text={`Not complete yet`} // todo: Change text based on completion of banning account mastery (i.e: "You're half way there! 50% more progress to go (100/200).")
								TextScaled={true}
								TextColor3={Color3.fromRGB(255, 255, 255)}
							>
								<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 79, 130) }} />
							</textlabel>

							<frame // todo: Convert to image label of banning account mastery
								AnchorPoint={vec2Middle}
								BackgroundColor3={Color3.fromRGB(14, 165, 253)}
								Position={UDim2.fromScale(0.1, 0.5)}
								Size={UDim2.fromScale(0.9, 0.9)}
							>
								<uiaspectratioconstraint AspectRatio={1} />
								<uicorner CornerRadius={new UDim(1, 0)} />
								<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 79, 130) }} />
							</frame>
						</frame>

						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.675)}
							Size={UDim2.fromScale(0.85, 0.05)}
							Font={font}
							Text={`or purchase the gamepass:`}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
						>
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 79, 130) }} />
						</textlabel>
						<frame
							AnchorPoint={vec2Middle}
							BackgroundTransparency={0}
							BackgroundColor3={Color3.fromRGB(13, 147, 230)}
							Position={UDim2.fromScale(0.5, 0.815)}
							Size={UDim2.fromScale(0.6, 0.175)}
						>
							<uicorner CornerRadius={new UDim(0.15, 0)} />
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 79, 130) }} />

							<textlabel
								AnchorPoint={vec2Middle}
								BackgroundTransparency={1}
								Position={UDim2.fromScale(0.4, 0.5)}
								Size={UDim2.fromScale(0.2, 0.4)}
								Font={font}
								Text={`R$249`}
								TextScaled={true}
								TextColor3={Color3.fromRGB(85, 255, 127)}
							>
								<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 79, 130) }} />
							</textlabel>
							<imagebutton
								AnchorPoint={vec2Middle}
								BackgroundTransparency={1}
								Position={UDim2.fromScale(0.8, 0.5)}
								Size={binding.map((value) => {
									return UDim2.fromScale(0.35, value);
								})}
								Image={assetIds.images.ui.index.Claim}
								ScaleType={Enum.ScaleType.Fit}
								Event={{
									/* eslint-disable jsdoc/require-jsdoc */
									Activated: (): void => {
										playSFX(UIEngagement.MinorEngagement);
									},
									MouseEnter: (): void => motor.setGoal(minimizedSpring),
									MouseLeave: (): void => motor.setGoal(maximizedSpring),
									/* eslint-enable jsdoc/require-jsdoc */
								}}
							>
								<uiaspectratioconstraint AspectRatio={2} />
								<textlabel
									AnchorPoint={vec2Middle}
									BackgroundTransparency={1}
									Position={UDim2.fromScale(0.5, 0.5)}
									Size={UDim2.fromScale(0.8, 0.8)}
									Font={font}
									Text={`Buy`}
									TextScaled={true}
									TextColor3={Color3.fromRGB(255, 255, 255)}
								>
									<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(41, 120, 31) }} />
								</textlabel>
							</imagebutton>

							<frame // todo: Convert to image label of auto fight gamepass
								AnchorPoint={vec2Middle}
								BackgroundColor3={Color3.fromRGB(14, 165, 253)}
								Position={UDim2.fromScale(0.135, 0.5)}
								Size={UDim2.fromScale(0.9, 0.9)}
							>
								<uiaspectratioconstraint AspectRatio={1} />
								<uicorner CornerRadius={new UDim(1, 0)} />
								<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 79, 130) }} />
							</frame>
						</frame>

						<ExitButton
							Position={UDim2.fromScale(0.975, 0.125)}
							minimizedSize={0.085}
							maximizedSize={0.1}
							onClosed={(): void => props.hideMenu()}
						/>
					</imagelabel>
				);
			} else {
				const minimizedSize = 0.35;
				const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

				const maximizedSize = 0.4;
				const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

				const { motor, binding } = useBindingMotor(hooks, maximizedSize);

				return (
					<imagelabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Size={UDim2.fromScale(0.35, 0.4)}
						Position={UDim2.fromScale(0.5, 0.75)}
						Image={assetIds.images.ui.autoFight.minimized}
						ScaleType={Enum.ScaleType.Fit}
					>
						<uiaspectratioconstraint AspectRatio={3.2} />

						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.4)}
							Size={UDim2.fromScale(0.9, 0.3)}
							Font={font}
							Text={`Auto fight is not enabled.`}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
						>
							<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 79, 130) }} />
						</textlabel>

						<imagebutton
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.9)}
							Size={binding.map((value) => {
								return UDim2.fromScale(0.4, value);
							})}
							Image={assetIds.images.ui.index.Claim}
							ScaleType={Enum.ScaleType.Fit}
							Event={{
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

									setSelectedZone(landingFolder.Name);
									setIsEnabled(true);
								},
								MouseEnter: (): void => motor.setGoal(minimizedSpring),
								MouseLeave: (): void => motor.setGoal(maximizedSpring),
								/* eslint-enable jsdoc/require-jsdoc */
							}}
						>
							<uiaspectratioconstraint AspectRatio={2} />
							<textlabel
								AnchorPoint={vec2Middle}
								BackgroundTransparency={1}
								Position={UDim2.fromScale(0.51, 0.5)}
								Size={UDim2.fromScale(0.9, 0.9)}
								Font={font}
								Text={`Enable`}
								TextScaled={true}
								TextColor3={Color3.fromRGB(255, 255, 255)}
							>
								<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(43, 150, 61) }} />
							</textlabel>
						</imagebutton>

						<ExitButton
							Position={UDim2.fromScale(0.975, 0.05)}
							minimizedSize={0.25}
							maximizedSize={0.3}
							onClosed={(): void => props.hideMenu()}
						/>
					</imagelabel>
				);
			}
		} else {
			if (!viewingRewards) {
				const minimizedSize = 0.35;
				const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

				const maximizedSize = 0.4;
				const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

				const { motor, binding } = useBindingMotor(hooks, maximizedSize);

				return (
					<imagelabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Size={UDim2.fromScale(0.35, 0.4)}
						Position={UDim2.fromScale(0.5, 0.75)}
						Image={assetIds.images.ui.autoFight.minimized}
						ScaleType={Enum.ScaleType.Fit}
					>
						<uiaspectratioconstraint AspectRatio={3.2} />

						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.15)}
							Size={UDim2.fromScale(0.9, 0.2)}
							Font={font}
							Text={`Auto Fight has been active for: ${formatTime(timeElapsed)}`}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
						>
							<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 79, 130) }} />
						</textlabel>

						<imagelabel
							AnchorPoint={vec2Middle}
							Position={UDim2.fromScale(0.25, 0.5)}
							Size={UDim2.fromScale(0.475, 0.3)}
							BackgroundTransparency={1}
							Image={assetIds.images.ui.settings["setting background"]}
						>
							<textlabel
								AnchorPoint={vec2Middle}
								Position={UDim2.fromScale(0.35, 0.5)}
								Size={UDim2.fromScale(0.6, 0.8)}
								BackgroundTransparency={1}
								TextScaled={true}
								TextColor3={Color3.fromRGB(255, 255, 255)}
								TextXAlignment={Enum.TextXAlignment.Left}
								Font={font}
								Text={"Buy Weapons"}
							>
								<BaseUIStroke native={{ Thickness: 2 }} />
							</textlabel>
							{/*
							<EnabledButton
								AnchorPoint={vec2Middle}
								isEnabled={purchaseWeaponsEnabled}
								Position={UDim2.fromScale(0.85, 0.5)}
								minimizedSize={{ x: 0.225, y: 0.6 }}
								maximizedSize={{ x: 0.25, y: 0.7 }}
								onClicked={(): void => setPurchaseWeaponsEnabled(!purchaseWeaponsEnabled)}
							/> */}
						</imagelabel>

						<imagelabel
							AnchorPoint={vec2Middle}
							Position={UDim2.fromScale(0.75, 0.5)}
							Size={UDim2.fromScale(0.475, 0.3)}
							BackgroundTransparency={1}
							Image={assetIds.images.ui.settings["setting background"]}
						>
							<textlabel
								AnchorPoint={vec2Middle}
								Position={UDim2.fromScale(0.35, 0.5)}
								Size={UDim2.fromScale(0.6, 0.8)}
								BackgroundTransparency={1}
								TextScaled={true}
								TextColor3={Color3.fromRGB(255, 255, 255)}
								TextXAlignment={Enum.TextXAlignment.Left}
								Font={font}
								Text={"Buy Ranks"}
							>
								<BaseUIStroke native={{ Thickness: 2 }} />
							</textlabel>
							{/*
							<EnabledButton
								AnchorPoint={vec2Middle}
								isEnabled={autoRankEnabled}
								Position={UDim2.fromScale(0.85, 0.5)}
								minimizedSize={{ x: 0.225, y: 0.6 }}
								maximizedSize={{ x: 0.25, y: 0.7 }}
								onClicked={(): void => setAutoRankEnabled(!autoRankEnabled)}
							/>
							*/}
						</imagelabel>

						<imagebutton
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.9)}
							Size={binding.map((value) => {
								if (value < minimizedSize) {
									return UDim2.fromScale(minimizedSize, minimizedSize);
								}

								return UDim2.fromScale(value, value);
							})}
							Image={assetIds.images.ui.index.Claim}
							ScaleType={Enum.ScaleType.Fit}
							Event={{
								/* eslint-disable jsdoc/require-jsdoc */
								Activated: (): void => {
									playSFX(UIEngagement.MinorEngagement);
									setViewingRewards(true);
								},
								MouseEnter: (): void => motor.setGoal(minimizedSpring),
								MouseLeave: (): void => motor.setGoal(maximizedSpring),
								/* eslint-enable jsdoc/require-jsdoc */
							}}
						>
							<uiaspectratioconstraint AspectRatio={2} />
							<textlabel
								AnchorPoint={vec2Middle}
								BackgroundTransparency={1}
								Position={UDim2.fromScale(0.51, 0.5)}
								Size={UDim2.fromScale(0.9, 0.9)}
								Font={font}
								Text={`Rewards`}
								TextScaled={true}
								TextColor3={Color3.fromRGB(255, 255, 255)}
							>
								<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(43, 150, 61) }} />
							</textlabel>
						</imagebutton>
					</imagelabel>
				);
			} else {
				const cachedWeaponData = getWeaponInfo(autoFightCache.startingWeapon);
				const storedWeaponData = getWeaponInfo(props.currentWeapon.id);

				const minimizedSize = 0.2;
				const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

				const maximizedSize = 0.25;
				const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

				const continueMotor = useBindingMotor(hooks, maximizedSize);
				const disableMotor = useBindingMotor(hooks, maximizedSize);

				return (
					<imagelabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.5, 0.675)}
						Image={assetIds.images.ui.teleportation.background}
						ScaleType={Enum.ScaleType.Fit}
					>
						<uiaspectratioconstraint AspectRatio={1.163} />

						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.063)}
							Size={UDim2.fromScale(0.425, 0.11)}
							Font={font}
							Text={`Auto Fight`}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
						>
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(165, 90, 7) }} />
						</textlabel>

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
									<frame
										AnchorPoint={vec2Middle}
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
										<textlabel
											AnchorPoint={vec2Middle}
											BackgroundTransparency={1}
											Position={UDim2.fromScale(0.4, 0.5)}
											Size={UDim2.fromScale(0.5, 0.5)}
											Font={font}
											Text={`${
												currencyData.name === "coins" ? "Coins" : currencyData.name === "gems" ? "Gems" : "Currency"
											} Earned:`}
											TextScaled={true}
											TextColor3={Color3.fromRGB(255, 255, 255)}
											TextXAlignment={Enum.TextXAlignment.Left}
										>
											<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 79, 130) }} />
										</textlabel>
										<textlabel
											AnchorPoint={vec2Middle}
											BackgroundTransparency={1}
											Position={UDim2.fromScale(0.825, 0.5)}
											Size={UDim2.fromScale(0.3, 0.7)}
											Font={font}
											Text={twoDpAbbreviator.numberToString(currencyData.amount)}
											TextScaled={true}
											TextColor3={Color3.fromRGB(255, 255, 255)}
											TextXAlignment={Enum.TextXAlignment.Right}
										>
											<BaseUIStroke
												native={{ Thickness: 1.5, Color: Color3.fromRGB(255, 255, 255) }}
												currencyGradient={currencyData.name}
											/>
										</textlabel>
									</frame>
								);
							})}

							<frame
								AnchorPoint={vec2Middle}
								BackgroundColor3={Color3.fromRGB(26, 116, 172)}
								Size={UDim2.fromScale(1, 0.12)}
							>
								<uicorner CornerRadius={new UDim(0.3, 0)} />
								<textlabel
									AnchorPoint={vec2Middle}
									BackgroundTransparency={1}
									Position={UDim2.fromScale(0.265, 0.5)}
									Size={UDim2.fromScale(0.5, 0.5)}
									Font={font}
									Text={"Starting Rank:"}
									TextScaled={true}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextXAlignment={Enum.TextXAlignment.Left}
								>
									<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 79, 130) }} />
								</textlabel>
								<RankIcon
									rank={autoFightCache.startingRank}
									position={UDim2.fromScale(0.925, 0.5)}
									size={{ minimizedSize: 0.8, maximizedSize: 0.9 }}
								/>
							</frame>

							<frame
								AnchorPoint={vec2Middle}
								BackgroundColor3={Color3.fromRGB(26, 116, 172)}
								Size={UDim2.fromScale(1, 0.12)}
							>
								<uicorner CornerRadius={new UDim(0.3, 0)} />
								<textlabel
									AnchorPoint={vec2Middle}
									BackgroundTransparency={1}
									Position={UDim2.fromScale(0.265, 0.5)}
									Size={UDim2.fromScale(0.5, 0.5)}
									Font={font}
									Text={"Ending Rank:"}
									TextScaled={true}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextXAlignment={Enum.TextXAlignment.Left}
								>
									<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 79, 130) }} />
								</textlabel>
								<RankIcon
									rank={props.rank}
									position={UDim2.fromScale(0.925, 0.5)}
									size={{ minimizedSize: 0.8, maximizedSize: 0.9 }}
								/>
							</frame>

							<frame
								AnchorPoint={vec2Middle}
								BackgroundColor3={Color3.fromRGB(26, 116, 172)}
								Size={UDim2.fromScale(1, 0.12)}
							>
								<uicorner CornerRadius={new UDim(0.3, 0)} />
								<textlabel
									AnchorPoint={vec2Middle}
									BackgroundTransparency={1}
									Position={UDim2.fromScale(0.265, 0.5)}
									Size={UDim2.fromScale(0.5, 0.5)}
									Font={font}
									Text={"Starting Weapon:"}
									TextScaled={true}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextXAlignment={Enum.TextXAlignment.Left}
								>
									<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 79, 130) }} />
								</textlabel>
								<textlabel
									AnchorPoint={vec2Middle}
									BackgroundTransparency={1}
									Position={UDim2.fromScale(0.825, 0.5)}
									Size={UDim2.fromScale(0.3, 0.7)}
									Font={font}
									Text={cachedWeaponData.name}
									TextScaled={true}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextXAlignment={Enum.TextXAlignment.Right}
								>
									<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 79, 130) }} />
								</textlabel>
							</frame>

							<frame
								AnchorPoint={vec2Middle}
								BackgroundColor3={Color3.fromRGB(26, 116, 172)}
								Size={UDim2.fromScale(1, 0.12)}
							>
								<uicorner CornerRadius={new UDim(0.3, 0)} />
								<textlabel
									AnchorPoint={vec2Middle}
									BackgroundTransparency={1}
									Position={UDim2.fromScale(0.265, 0.5)}
									Size={UDim2.fromScale(0.5, 0.5)}
									Font={font}
									Text={"Ending Weapon:"}
									TextScaled={true}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextXAlignment={Enum.TextXAlignment.Left}
								>
									<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 79, 130) }} />
								</textlabel>
								<textlabel
									AnchorPoint={vec2Middle}
									BackgroundTransparency={1}
									Position={UDim2.fromScale(0.825, 0.5)}
									Size={UDim2.fromScale(0.3, 0.7)}
									Font={font}
									Text={storedWeaponData.name}
									TextScaled={true}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextXAlignment={Enum.TextXAlignment.Right}
								>
									<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 79, 130) }} />
								</textlabel>
							</frame>
						</scrollingframe>

						<imagebutton
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.7, 1.1)}
							Size={continueMotor.binding.map((value) => {
								if (value > maximizedSize) {
									return UDim2.fromScale(maximizedSize, maximizedSize);
								}

								return UDim2.fromScale(value, value);
							})}
							Image={assetIds.images.ui.index.Claim}
							ScaleType={Enum.ScaleType.Fit}
							Event={{
								/* eslint-disable jsdoc/require-jsdoc */
								Activated: (): void => {
									playSFX(UIEngagement.MinorEngagement);
									setViewingRewards(false);
								},
								MouseEnter: (): void => continueMotor.motor.setGoal(minimizedSpring),
								MouseLeave: (): void => continueMotor.motor.setGoal(maximizedSpring),
								/* eslint-enable jsdoc/require-jsdoc */
							}}
						>
							<uiaspectratioconstraint AspectRatio={2} />

							<textlabel
								AnchorPoint={vec2Middle}
								BackgroundTransparency={1}
								Position={UDim2.fromScale(0.5, 0.5)}
								Size={UDim2.fromScale(0.9, 0.9)}
								Font={font}
								Text={"Continue"}
								TextColor3={Color3.fromRGB(255, 255, 255)}
								TextScaled={true}
							>
								<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(43, 150, 61) }} />
							</textlabel>
						</imagebutton>

						<imagebutton
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.3, 1.1)}
							Size={disableMotor.binding.map((value) => {
								if (value > maximizedSize) {
									return UDim2.fromScale(maximizedSize, maximizedSize);
								}

								return UDim2.fromScale(value, value);
							})}
							Image={assetIds.images.ui.index.Off}
							ScaleType={Enum.ScaleType.Fit}
							Event={{
								/* eslint-disable jsdoc/require-jsdoc */
								Activated: (): void => {
									playSFX(UIEngagement.MinorEngagement);
									setTimeElapsed(0);
									setViewingRewards(false);
									setIsEnabled(false);
								},
								MouseEnter: (): void => disableMotor.motor.setGoal(minimizedSpring),
								MouseLeave: (): void => disableMotor.motor.setGoal(maximizedSpring),
								/* eslint-enable jsdoc/require-jsdoc */
							}}
						>
							<uiaspectratioconstraint AspectRatio={2} />

							<textlabel
								AnchorPoint={vec2Middle}
								BackgroundTransparency={1}
								Position={UDim2.fromScale(0.5, 0.5)}
								Size={UDim2.fromScale(0.9, 0.9)}
								Font={font}
								Text={"Disable"}
								TextColor3={Color3.fromRGB(255, 255, 255)}
								TextScaled={true}
							>
								<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(150, 43, 43) }} />
							</textlabel>
						</imagebutton>
					</imagelabel>
				);
			}
		}
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
