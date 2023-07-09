import Roact from "@rbxts/roact";
import { uiHeaderStrokeColor, vec2Middle } from "client/ui/commonValues";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { WorldName } from "shared/configs/worlds";

import { PrestigeCard } from "./prestigeCard";

/**
 * A component allowing the user to purchase and claim rewards via world prestige.
 */
export const WorldPrestigePath = hooks(
	(props: { worldName: WorldName; setVisibility: (value: boolean) => void }, { useValue, useEffect }) => {
		const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
		useEffect(() => {
			const uiListLayout = uiListLayoutRef.value.getValue();
			assert(uiListLayout, `Failed to get world prestige UIGridLayout.`);

			const scrollingFrame = uiListLayout.Parent;
			assert(scrollingFrame, `Failed to get world prestige ScrollingFrame.`);
			assert(scrollingFrame.IsA("ScrollingFrame"), `Expected world prestige to have a ScrollingFrame.`);

			scrollingFrame.GetChildren().forEach((prestigeCard) => {
				if (prestigeCard.IsA("Frame")) {
					prestigeCard.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
				}
			});

			const connection = scrollingFrame.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
				scrollingFrame.GetChildren().forEach((prestigeCard) => {
					if (prestigeCard.IsA("Frame")) {
						prestigeCard.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
					}
				});
			});

			return (): void => connection.Disconnect();
		});

		const prestigeCards: Array<Roact.Element> = [];
		for (let i = 1; i <= 51; i++) {
			prestigeCards.push(<PrestigeCard worldName={props.worldName} prestigeNumber={i} />);
		}

		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.5, 0.75),
					Image: assetIds.images.ui["rank upgrade"].background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1} />

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.058),
						Size: UDim2.fromScale(0.4, 0.1),
						Text: "Prestige",
					}}
					stroke={{ native: { Thickness: 2, Color: uiHeaderStrokeColor } }}
				/>
				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.55)}
					Size={UDim2.fromScale(0.95, 0.835)}
					ScrollBarThickness={0}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uilistlayout
						SortOrder={Enum.SortOrder.LayoutOrder}
						Ref={uiListLayoutRef.value}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						Padding={new UDim(0, 5)}
					/>
					{prestigeCards}
				</RescalingScrollingFrame>
				<ExitButton
					Position={UDim2.fromScale(0.985, 0.09)}
					minimizedSize={0.06}
					maximizedSize={0.075}
					onClosed={(): void => {
						playSFX(UIEngagement.MinorEngagement);

						props.setVisibility(false);
					}}
				/>
			</ImageLabel>
		);
	},
);
