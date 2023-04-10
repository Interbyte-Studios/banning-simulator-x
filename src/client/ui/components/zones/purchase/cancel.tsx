// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { uiOffButtonStrokeColor } from "client/ui/commonValues";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

interface CancelZonePurchaseProps {
	hideMenu: () => void;
}

/**
 * Ineraction UI roact component for exiting the zone prompt purchase ui.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const CancelZonePurchase = hooks((props: CancelZonePurchaseProps) => {
	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.25, 0.85),
				Image: assetIds.images.ui.index.Off,
			}}
			size={{ minSize: 0.175, maxSize: 0.2 }}
			events={{
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.hideMenu();
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={2} />
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.85, 0.6),
					Text: "Cancel",
				}}
				stroke={{ native: { Thickness: 2, Color: uiOffButtonStrokeColor } }}
			/>
		</SpringImageButton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
