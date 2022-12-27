import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { RescalingScrollingFrame } from "client/ui/elements/rescalingScrollingFrame";
import { TitleGradient } from "client/ui/elements/titleGradient";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { TITLES, TitleType } from "shared/configs/titles";
import { StoreState } from "shared/rodux";

interface TitlesItemsMappedProps {
	state: StoreState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): TitlesItemsMappedProps {
	return {
		state: state,
	};
}

/**
 * An item inventory for titles.
 */
export const TitlesItems = RoactRodux.connect(mapStateToProps)(
	hooks((props: TitlesItemsMappedProps, hooks) => {
		const { useState, useValue, useEffect, useContext } = hooks;
		const [titlesDisplayed, setTitlesDisplayed] = useState<TitleType>(TitleType.Weapons);

		const { equipTitle } = useContext(remoteContext);

		const maxSize = 0.3;
		const minSize = 0.275;

		const maxSpring = new Flipper.Spring(maxSize, { frequency: 5 });
		const minSpring = new Flipper.Spring(minSize, { frequency: 5 });

		const wepMotor = useBindingMotor(hooks, maxSize);
		const petMotor = useBindingMotor(hooks, maxSize);
		const miscMotor = useBindingMotor(hooks, maxSize);

		const titlesToDisplay = TITLES.filter((title) => title.category === titlesDisplayed);

		const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
		useEffect(() => {
			const uiListLayout = uiListLayoutRef.value.getValue();
			assert(uiListLayout, `Failed to get pet mastery UIGridLayout.`);

			const scrollingFrame = uiListLayout.Parent;
			assert(scrollingFrame, `Failed to get pet mastery ScrollingFrame.`);
			assert(scrollingFrame.IsA("ScrollingFrame"), `Expected pet mastery to have a ScrollingFrame.`);

			scrollingFrame.GetChildren().forEach((petCard) => {
				if (petCard.IsA("Frame")) {
					petCard.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 9);
				}
			});

			const connection = scrollingFrame.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
				scrollingFrame.GetChildren().forEach((petCard) => {
					if (petCard.IsA("Frame")) {
						petCard.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 9);
					}
				});
			});

			return (): void => connection.Disconnect();
		});

		return (
			<>
				<frame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.21)}
					Size={UDim2.fromScale(0.9, 0.07)}
				>
					<uilistlayout
						Padding={new UDim(0.025, 0)}
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						SortOrder={Enum.SortOrder.LayoutOrder}
					/>
					<imagebutton
						AnchorPoint={vec2Middle}
						BackgroundTransparency={0}
						BorderSizePixel={0}
						BackgroundColor3={Color3.fromRGB(49, 123, 188)}
						LayoutOrder={1}
						Size={wepMotor.binding.map((value) => {
							return UDim2.fromScale(value, 1);
						})}
						Image={""}
						Event={{
							/* eslint-disable jsdoc/require-jsdoc */
							MouseEnter: (): void => wepMotor.motor.setGoal(minSpring),
							MouseLeave: (): void => wepMotor.motor.setGoal(maxSpring),
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								setTitlesDisplayed(TitleType.Weapons);
							},
							/* eslint-enable jsdoc/require-jsdoc */
						}}
					>
						<uicorner CornerRadius={new UDim(0.12, 0)} />
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 89, 144) }} />

						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(0.95, 0.95)}
							Font={font}
							Text={"Weapons"}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
						>
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 89, 144) }} />
						</textlabel>
					</imagebutton>
					<imagebutton
						AnchorPoint={vec2Middle}
						BackgroundTransparency={0}
						BorderSizePixel={0}
						BackgroundColor3={Color3.fromRGB(49, 123, 188)}
						LayoutOrder={1}
						Size={petMotor.binding.map((value) => {
							return UDim2.fromScale(value, 1);
						})}
						Image={""}
						Event={{
							/* eslint-disable jsdoc/require-jsdoc */
							MouseEnter: (): void => petMotor.motor.setGoal(minSpring),
							MouseLeave: (): void => petMotor.motor.setGoal(maxSpring),
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								setTitlesDisplayed(TitleType.Pets);
							},
							/* eslint-enable jsdoc/require-jsdoc */
						}}
					>
						<uicorner CornerRadius={new UDim(0.12, 0)} />
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 89, 144) }} />

						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(0.95, 0.95)}
							Font={font}
							Text={"Pets"}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
						>
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 89, 144) }} />
						</textlabel>
					</imagebutton>
					<imagebutton
						AnchorPoint={vec2Middle}
						BackgroundTransparency={0}
						BorderSizePixel={0}
						BackgroundColor3={Color3.fromRGB(49, 123, 188)}
						LayoutOrder={1}
						Size={miscMotor.binding.map((value) => {
							return UDim2.fromScale(value, 1);
						})}
						Image={""}
						Event={{
							/* eslint-disable jsdoc/require-jsdoc */
							MouseEnter: (): void => miscMotor.motor.setGoal(minSpring),
							MouseLeave: (): void => miscMotor.motor.setGoal(maxSpring),
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								setTitlesDisplayed(TitleType.Misc);
							},
							/* eslint-enable jsdoc/require-jsdoc */
						}}
					>
						<uicorner CornerRadius={new UDim(0.12, 0)} />
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 89, 144) }} />

						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(0.95, 0.95)}
							Font={font}
							Text={"Misc"}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
						>
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 89, 144) }} />
						</textlabel>
					</imagebutton>
				</frame>
				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.615)}
					Size={UDim2.fromScale(0.95, 0.7)}
					ScrollBarThickness={0}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uilistlayout
						SortOrder={Enum.SortOrder.LayoutOrder}
						Ref={uiListLayoutRef.value}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						Padding={new UDim(0, 15)}
					/>
					{titlesToDisplay.map((title) => {
						let titleColor = Color3.fromRGB(255, 255, 255);
						const titleGradient: Array<Roact.Element> = [];
						if (typeIs(title.effect, "Color3")) {
							titleColor = title.effect;
						} else {
							titleGradient.push(<TitleGradient titleId={title.id} />);
						}

						const meetsCondition = title.condition(props.state);

						const maxSize = 0.15;
						const minSize = 0.125;

						const maxSpring = new Flipper.Spring(maxSize, { frequency: 5 });
						const minSpring = new Flipper.Spring(minSize, { frequency: 5 });

						const motor = useBindingMotor(hooks, maxSize);

						return (
							<frame
								AnchorPoint={vec2Middle}
								BackgroundTransparency={1}
								Size={UDim2.fromScale(1, 0.2)}
								LayoutOrder={title.id}
							>
								<frame
									AnchorPoint={vec2Middle}
									BackgroundTransparency={0}
									BackgroundColor3={Color3.fromRGB(49, 123, 188)}
									Position={UDim2.fromScale(0.5, 0.5)}
									Size={UDim2.fromScale(0.99, 0.95)}
								>
									<uiaspectratioconstraint AspectRatio={9.6} />
									<uicorner CornerRadius={new UDim(0.1, 0)} />
									<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 89, 144) }} />

									<textlabel
										AnchorPoint={vec2Middle}
										BackgroundTransparency={1}
										Position={UDim2.fromScale(0.26, 0.25)}
										Size={UDim2.fromScale(0.5, 0.5)}
										Font={font}
										Text={title.name}
										TextScaled={true}
										TextColor3={titleColor}
										TextXAlignment={Enum.TextXAlignment.Left}
									>
										<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 89, 144) }} />
										{titleGradient}
									</textlabel>
									<textlabel
										AnchorPoint={vec2Middle}
										BackgroundTransparency={1}
										Position={UDim2.fromScale(0.41, 0.75)}
										Size={UDim2.fromScale(0.8, 0.35)}
										Font={font}
										Text={title.description}
										TextScaled={true}
										TextColor3={Color3.fromRGB(255, 255, 255)}
										TextXAlignment={Enum.TextXAlignment.Left}
									>
										<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 89, 144) }} />
									</textlabel>
									<imagebutton
										AnchorPoint={vec2Middle}
										BackgroundTransparency={1}
										Position={UDim2.fromScale(0.9, 0.5)}
										Size={motor.binding.map((value) => {
											return UDim2.fromScale(value, 0.95);
										})}
										Image={meetsCondition ? assetIds.images.ui.index.Claim : assetIds.images.ui.index.Off}
										ScaleType={Enum.ScaleType.Fit}
										Event={{
											/* eslint-disable jsdoc/require-jsdoc */
											MouseEnter: (): void => motor.motor.setGoal(minSpring),
											MouseLeave: (): void => motor.motor.setGoal(maxSpring),
											Activated: (): void => {
												playSFX(UIEngagement.MinorEngagement);
												equipTitle.SendToServer(title.name);
											},
											/* eslint-enable jsdoc/require-jsdoc */
										}}
									>
										<uiaspectratioconstraint AspectRatio={2} />
										<textlabel
											AnchorPoint={vec2Middle}
											BackgroundTransparency={1}
											Position={UDim2.fromScale(0.5, 0.5)}
											Size={UDim2.fromScale(0.85, 0.85)}
											Font={font}
											Text={meetsCondition ? (props.state.title === title.name ? "Equipped" : "Equip") : "Unowned"}
											TextScaled={true}
											TextColor3={Color3.fromRGB(255, 255, 255)}
										>
											<BaseUIStroke
												native={{
													Thickness: 2,
													Color: meetsCondition ? Color3.fromRGB(27, 145, 55) : Color3.fromRGB(152, 54, 54),
												}}
											/>
										</textlabel>
									</imagebutton>
								</frame>
							</frame>
						);
					})}
				</RescalingScrollingFrame>
			</>
		);
	}),
);
