// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { uiClaimButtonStrokeColor } from "client/ui/commonValues";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/**
 * A button which allows the user to view the next weapon in the talisman tower.
 *
 * @param props The props to render with.
 * @param props.onActivated The callback to fire when the button is activated.
 * @returns The element to render.
 */
export const ViewNextTalisman = (props: { onActivated: () => void }): Roact.Element => {
	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.65, 0.8),
				Image: assetIds.images.buttons["green button"],
			}}
			size={{ minSize: 0.085, maxSize: 0.1 }}
			events={{
				/* eslint-disable jsdoc/require-jsdoc */
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.onActivated();
				},
				/* eslint-enable jsdoc/require-jsdoc */
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.9, 0.9),
					Text: ">",
				}}
				stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
			/>
		</SpringImageButton>
	);
};
