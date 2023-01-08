import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { ExitButton } from "client/ui/elements/exitButton";
import { hooks } from "client/ui/hooks";
import { formatTime } from "client/util/formatTime";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { GamepassesState } from "shared/rodux/gamepasses";
import { WorldsState } from "shared/rodux/worlds";

import { EnabledButton } from "../settings/elements/enabledButton";
import { ToggleSettingOption } from "../settings/elements/toggleSettingOption";

interface AutoFightProps extends AutoFightMappedProps {
	enabled: boolean;
	hideMenu: () => void;
}

interface AutoFightMappedProps {
	gamepasses: GamepassesState;
	worlds: WorldsState;
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

		const { useState, useEffect } = hooks;
		const [isEnabled, setIsEnabled] = useState(true);
		const [timeElapsed, setTimeElapsed] = useState(0);
		const [autoRankEnabled, setAutoRankEnabled] = useState(false);
		const [purchaseWeaponsEnabled, setPurchaseWeaponsEnabled] = useState(false);
		const [viewingRewards, isViewingRewards] = useState(false);

		// if they have teleport gamepass, allow them to select a zone to enable auto fight for.
		// if they do not have teleport gamepass, find the zone they're in and then enable auto fight for them.
		// if auto fight is attempted to be enabled while they do not own teleport gamepass and a zone cannot be found, display an error to the player

		if (!isEnabled) {
			const displayedComponents: Array<Roact.Element> = [];

			// todo: Add case for if they also do not have it unlocked through account mastery
			if (!props.gamepasses.Teleportation) {
				const minimizedSize = 0.6;
				const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

				const maximizedSize = 0.7;
				const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

				const { motor, binding } = useBindingMotor(hooks, maximizedSize);

				displayedComponents.push(
					<>
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
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 108, 176) }} />
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
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 108, 176) }} />
						</textlabel>
						<frame
							AnchorPoint={vec2Middle}
							BackgroundTransparency={0}
							BackgroundColor3={Color3.fromRGB(13, 147, 230)}
							Position={UDim2.fromScale(0.5, 0.51)}
							Size={UDim2.fromScale(0.9, 0.175)}
						>
							<uicorner CornerRadius={new UDim(0.15, 0)} />
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 108, 176) }} />

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
								<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 108, 176) }} />
							</textlabel>

							<frame // todo: Convert to image label of banning account mastery
								AnchorPoint={vec2Middle}
								BackgroundColor3={Color3.fromRGB(14, 165, 253)}
								Position={UDim2.fromScale(0.1, 0.5)}
								Size={UDim2.fromScale(0.9, 0.9)}
							>
								<uiaspectratioconstraint AspectRatio={1} />
								<uicorner CornerRadius={new UDim(1, 0)} />
								<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 108, 176) }} />
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
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 108, 176) }} />
						</textlabel>
						<frame
							AnchorPoint={vec2Middle}
							BackgroundTransparency={0}
							BackgroundColor3={Color3.fromRGB(13, 147, 230)}
							Position={UDim2.fromScale(0.5, 0.815)}
							Size={UDim2.fromScale(0.6, 0.175)}
						>
							<uicorner CornerRadius={new UDim(0.15, 0)} />
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 108, 176) }} />

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
								<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 108, 176) }} />
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
								<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 108, 176) }} />
							</frame>
						</frame>
					</>,
				);
			} else {
				const minimizedSize = 0.2;
				const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

				const maximizedSize = 0.25;
				const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

				const { motor, binding } = useBindingMotor(hooks, maximizedSize);

				displayedComponents.push(
					<>
						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.475)}
							Size={UDim2.fromScale(0.85, 0.11)}
							Font={font}
							Text={`Auto Fight is not enabled.`}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
						>
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 108, 176) }} />
						</textlabel>
					</>,
					<imagebutton
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.625)}
						Size={binding.map((value) => {
							return UDim2.fromScale(value, 0.6);
						})}
						Image={assetIds.images.ui.index.Claim}
						ScaleType={Enum.ScaleType.Fit}
						Event={{
							/* eslint-disable jsdoc/require-jsdoc */
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
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
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(0.8, 0.8)}
							Font={font}
							Text={`Enable`}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
						>
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(41, 120, 31) }} />
						</textlabel>
					</imagebutton>,
				);
			}

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
					{displayedComponents}

					<ExitButton
						Position={UDim2.fromScale(0.975, 0.125)}
						minimizedSize={0.085}
						maximizedSize={0.1}
						onClosed={(): void => props.hideMenu()}
					/>
				</imagelabel>
			);
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
							<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 108, 176) }} />
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
								return UDim2.fromScale(0.4, value);
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
				return <></>;
			}
		}
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
