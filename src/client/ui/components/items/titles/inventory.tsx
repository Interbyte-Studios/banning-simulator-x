import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { uiDarkStrokeColor, vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { TitleGradient } from "client/ui/elements/gradients/titleGradient";
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
				<BaseFrame Position={UDim2.fromScale(0.5, 0.21)} Size={UDim2.fromScale(0.9, 0.07)}>
					<uilistlayout
						Padding={new UDim(0.025, 0)}
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						SortOrder={Enum.SortOrder.LayoutOrder}
					/>

					<SpringImageButton
						native={{
							BackgroundTransparency: 0,
							BackgroundColor3: Color3.fromRGB(49, 123, 188),
							LayoutOrder: 1,
							Image: "",
						}}
						size={{ minSize: 0.6, maxSize: 0.7 }}
						events={{
							/* eslint-disable jsdoc/require-jsdoc */
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								setTitlesDisplayed(TitleType.Weapons);
							},
							/* eslint-enable jsdoc/require-jsdoc */
						}}
					>
						<uicorner CornerRadius={new UDim(0.12, 0)} />
						<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />
						<uiaspectratioconstraint AspectRatio={8} />

						<StrokeTextLabel
							native={{
								Size: UDim2.fromScale(0.95, 0.95),
								Text: "Weapons",
							}}
							stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
						/>
					</SpringImageButton>

					<SpringImageButton
						native={{
							BackgroundTransparency: 0,
							BackgroundColor3: Color3.fromRGB(49, 123, 188),
							LayoutOrder: 2,
							Image: "",
						}}
						size={{ minSize: 0.6, maxSize: 0.7 }}
						events={{
							/* eslint-disable jsdoc/require-jsdoc */ Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								setTitlesDisplayed(TitleType.Pets);
								/* eslint-enable jsdoc/require-jsdoc */
							},
						}}
					>
						<uicorner CornerRadius={new UDim(0.12, 0)} />
						<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />
						<uiaspectratioconstraint AspectRatio={8} />

						<StrokeTextLabel
							native={{
								Size: UDim2.fromScale(0.95, 0.95),
								Text: "Pets",
							}}
							stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
						/>
					</SpringImageButton>

					<SpringImageButton
						native={{
							BackgroundTransparency: 0,
							BackgroundColor3: Color3.fromRGB(49, 123, 188),
							LayoutOrder: 3,
							Image: "",
						}}
						size={{ minSize: 0.6, maxSize: 0.7 }}
						events={{
							/* eslint-disable jsdoc/require-jsdoc */
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								setTitlesDisplayed(TitleType.Misc);
							},
							/* eslint-enable jsdoc/require-jsdoc */
						}}
					>
						<uicorner CornerRadius={new UDim(0.12, 0)} />
						<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />
						<uiaspectratioconstraint AspectRatio={8} />

						<StrokeTextLabel
							native={{
								Size: UDim2.fromScale(0.95, 0.95),
								Text: "Misc",
							}}
							stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
						/>
					</SpringImageButton>
				</BaseFrame>

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

						return (
							<BaseFrame Size={UDim2.fromScale(1, 0.2)} LayoutOrder={title.id}>
								<BaseFrame
									BackgroundTransparency={0}
									BackgroundColor3={Color3.fromRGB(49, 123, 188)}
									Size={UDim2.fromScale(0.99, 0.95)}
								>
									<uiaspectratioconstraint AspectRatio={9.6} />
									<uicorner CornerRadius={new UDim(0.1, 0)} />
									<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />

									<StrokeTextLabel
										native={{
											Position: UDim2.fromScale(0.26, 0.25),
											Size: UDim2.fromScale(0.5, 0.5),
											Text: title.name,
											TextColor3: titleColor,
											TextXAlignment: Enum.TextXAlignment.Left,
										}}
										stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
									>
										{titleGradient}
									</StrokeTextLabel>

									<StrokeTextLabel
										native={{
											Position: UDim2.fromScale(0.41, 0.75),
											Size: UDim2.fromScale(0.8, 0.35),
											Text: title.description,
											TextXAlignment: Enum.TextXAlignment.Left,
										}}
										stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
									/>

									<SpringImageButton
										native={{
											Position: UDim2.fromScale(0.9, 0.5),
											Image: meetsCondition ? assetIds.images.ui.index.Claim : assetIds.images.ui.index.Off,
										}}
										size={{ minSize: 0.7, maxSize: 0.8 }}
										events={{
											/* eslint-disable jsdoc/require-jsdoc */
											Activated: (): void => {
												playSFX(UIEngagement.MinorEngagement);
												equipTitle.SendToServer(title.name);
											},
											/* eslint-enable jsdoc/require-jsdoc */
										}}
									>
										<uiaspectratioconstraint AspectRatio={2} />

										<StrokeTextLabel
											native={{
												Size: UDim2.fromScale(0.85, 0.85),
												Text: meetsCondition ? (props.state.title === title.name ? "Equipped" : "Equip") : "Unowned",
											}}
											stroke={{
												native: {
													Thickness: 2,
													Color: meetsCondition ? Color3.fromRGB(27, 145, 55) : Color3.fromRGB(152, 54, 54),
												},
											}}
										/>
									</SpringImageButton>
								</BaseFrame>
							</BaseFrame>
						);
					})}
				</RescalingScrollingFrame>
			</>
		);
	}),
);
