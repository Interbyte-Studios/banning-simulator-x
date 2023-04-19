import Roact from "@rbxts/roact";
import { uiClaimButtonStrokeColor, uiTextStrokeColor } from "client/ui/commonValues";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import assetIds from "shared/assets";

/**
 * This component is shown when a trade is completed.
 *
 * @returns A Roact element that represents the trade complete component.
 */
export const TradeComplete = (): Roact.Element => {
	return (
		<>
			<SpringImageButton
				native={{
					Position: UDim2.fromScale(0.5, 0.88),
					Image: assetIds.images.ui.index.Claim,
				}}
				size={{ minSize: 0.175, maxSize: 0.2 }}
			>
				<uiaspectratioconstraint AspectRatio={2} />
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.9),
						Text: "Ok!",
					}}
					stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
				/>
			</SpringImageButton>

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.093),
					Size: UDim2.fromScale(0.96, 0.119),
					Text: "Congratulations!",
				}}
				stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
			/>

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.183),
					Size: UDim2.fromScale(0.96, 0.063),
					Text: "Your trade is complete.",
				}}
				stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
			/>

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.412),
					Size: UDim2.fromScale(0.96, 0.123),
					Text: "All trades are final. Our moderation team will not be able to reverse any trades that have been completed.",
				}}
				stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
			/>

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.587),
					Size: UDim2.fromScale(0.96, 0.123),
					Text: "If you experience any issues, please contact our team via Discord, and we will assist as best as possible.",
				}}
				stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
			/>
		</>
	);
};
