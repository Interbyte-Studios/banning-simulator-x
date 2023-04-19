import Roact from "@rbxts/roact";
import { uiTextStrokeColor, vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";

interface OfferProps {
	offerType: "Local" | "Foreign";
}

/**
 * The offer component is the component that displays the offer of the player.
 *
 * @param props The props of the component.
 * @returns The component.
 */
export const Offer = (props: OfferProps): Roact.Element => {
	return (
		<>
			<StrokeTextLabel
				native={{
					Position: props.offerType === "Local" ? UDim2.fromScale(0.085, 0) : UDim2.fromScale(0.585, 0),
					Size: UDim2.fromScale(0.35, 0.1),
					Text: props.offerType === "Local" ? "Your Offer" : "Their Offer",
				}}
				stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
			/>
			<BaseFrame
				Position={props.offerType === "Local" ? UDim2.fromScale(0.26, 0.34) : UDim2.fromScale(0.75, 0.34)}
				Size={props.offerType === "Local" ? UDim2.fromScale(0.46, 0.57) : UDim2.fromScale(0.46, 0.57)}
				BackgroundTransparency={1}
			>
				<uicorner CornerRadius={new UDim(0.125, 0)} />
				<BaseUIStroke native={{ Thickness: 4, Color: uiTextStrokeColor }} />
				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.508, 0.52)}
					Size={UDim2.fromScale(0.98, 0.915)}
					BackgroundTransparency={1}
				>
					<uigridlayout
						CellSize={UDim2.fromScale(0.3, 0.125)}
						CellPadding={UDim2.fromScale(0.025, 0)}
						SortOrder={Enum.SortOrder.LayoutOrder}
					/>
				</RescalingScrollingFrame>
			</BaseFrame>
		</>
	);
};
