// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { uiClaimButtonStrokeColor, uiTextStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import assetIds from "shared/assets";

/**
 * Displays a message that the trade is complete.
 *
 * @returns The Roact element to render.
 */
export const CompletedTrade = (): Roact.Element => {
	return (
		<BaseFrame Size={UDim2.fromScale(1, 1)}>
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
					Position: UDim2.fromScale(0.5, 0.587),
					Size: UDim2.fromScale(0.96, 0.123),
					Text: "If you experience any issues, please contact our team via Discord, and we will assist as best as possible.",
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

			<ImageButton
				native={{
					Position: UDim2.fromScale(0.5, 0.88),
					Size: UDim2.fromScale(0.2, 0.2),
					Image: assetIds.images.ui.index.Claim,
				}}
			>
				<uiaspectratioconstraint AspectRatio={2} />

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.9),
						Text: "Ok!",
					}}
					stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
				/>
			</ImageButton>
		</BaseFrame>
	);
};
