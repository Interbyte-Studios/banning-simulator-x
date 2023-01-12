import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players, Workspace } from "@rbxts/services";
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
import { isValidZone, ZoneNames } from "shared/configs/zones";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { CurrentWeaponState } from "shared/rodux/currentWeapon";
import { ExperienceState } from "shared/rodux/experience";
import { GamepassesState } from "shared/rodux/gamepasses";
import { RankState } from "shared/rodux/rank";
import { WorldsState } from "shared/rodux/worlds";
import { getWeaponInfo } from "shared/util/getWeaponInfo";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { EnabledButton } from "../settings/elements/enabledButton";

interface AutoFightCache {
	currencies: Array<{ name: Currency; amount: number }>;
	startingRank: number;
	endingRank: number;
	startingWeapon: number;
	endingWeapon: number;
	petExperience: number;
}

const autoFightCache: AutoFightCache = {
	currencies: currencies.map((value) => {
		return { name: value, amount: 0 };
	}),
	startingRank: 1,
	endingRank: 1,
	startingWeapon: 1,
	endingWeapon: 1,
	petExperience: 1,
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

		const { useState, useEffect, useContext } = hooks;
		const [isEnabled, setIsEnabled] = useState(false);
		const [zoneSelected, setSelectedZone] = useState<ZoneNames | undefined>(undefined);
		const [timeElapsed, setTimeElapsed] = useState(0);
		const [autoRankEnabled, setAutoRankEnabled] = useState(false);
		const [purchaseWeaponsEnabled, setPurchaseWeaponsEnabled] = useState(false);
		const [viewingRewards, setViewingRewards] = useState(false);

		const { unlockRank, purchaseWeapon } = useContext(remoteContext);
		const { addAnnouncement } = useContext(AnnouncementContext);

		useEffect(() => {
			task.spawn(() => {
				// eslint-disable-next-line no-constant-condition
				while (true) {
					if (!isEnabled) {
						return;
					}

					setTimeElapsed(timeElapsed + 1);
					task.wait(1);
				}
			});
		}, []);

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

			const nextWeapon = getWeaponInfo(props.currentWeapon.id + 1);
			if (nextWeapon === undefined) {
				return;
			}

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
						Size={UDim2.fromScale(0.4, 0.45)}
						Position={UDim2.fromScale(0.5, 0.8)}
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
										new Vector3(0, 100, 0),
										raycastParams,
									);

									if (raycastResult === undefined) {
										addAnnouncement("There was an issue while enabling auto fight (E-4).", AnnouncementType.Error);
										return;
									}

									if (raycastResult.Instance.Name !== "floor") {
										warn(raycastResult.Instance.Name, raycastResult.Instance.Parent?.Name);
										return;
									}

									const zoneFolder = raycastResult.Instance.Parent;
									if (zoneFolder === undefined) {
										addAnnouncement("There was an issue while enabling auto fight (E-5).", AnnouncementType.Error);
										return;
									}

									if (!isValidZone(zoneFolder.Name)) {
										addAnnouncement("There was an issue while enabling auto fight (E-6).", AnnouncementType.Error);
										return;
									}

									setSelectedZone(zoneFolder.Name);
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
						Size={UDim2.fromScale(0.4, 0.45)}
						Position={UDim2.fromScale(0.5, 0.8)}
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
							<EnabledButton
								AnchorPoint={vec2Middle}
								isEnabled={purchaseWeaponsEnabled}
								Position={UDim2.fromScale(0.85, 0.5)}
								minimizedSize={{ x: 0.225, y: 0.6 }}
								maximizedSize={{ x: 0.25, y: 0.7 }}
								onClicked={(): void => setPurchaseWeaponsEnabled(!purchaseWeaponsEnabled)}
							/>
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
							<EnabledButton
								AnchorPoint={vec2Middle}
								isEnabled={autoRankEnabled}
								Position={UDim2.fromScale(0.85, 0.5)}
								minimizedSize={{ x: 0.225, y: 0.6 }}
								maximizedSize={{ x: 0.25, y: 0.7 }}
								onClicked={(): void => setAutoRankEnabled(!autoRankEnabled)}
							/>
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

							{autoFightCache.currencies.map((currencyData) => {
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
									Text={"Pet Experience:"}
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
									Text={twoDpAbbreviator.numberToString(autoFightCache.petExperience)}
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
