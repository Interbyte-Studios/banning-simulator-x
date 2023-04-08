// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { BaseImageButton } from "client/ui/elements/baseElements/baseImageButton";
import { BaseTextLabel } from "client/ui/elements/baseElements/baseTextLabel";
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
		<BaseImageButton
			native={{
				Position: UDim2.fromScale(0.25, 0.85),
				Image: assetIds.images.ui.zones.cancel,
			}}
			size={{ minSize: 0.15, maxSize: 0.175 }}
			events={{
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.hideMenu();
				},
			}}
		>
			<BaseTextLabel
				native={{
					Size: UDim2.fromScale(0.85, 0.6),
					Text: "Cancel",
				}}
				stroke={{ native: { Thickness: 2 } }}
			/>
		</BaseImageButton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
