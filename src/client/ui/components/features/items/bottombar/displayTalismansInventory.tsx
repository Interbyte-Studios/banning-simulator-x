import Roact from "@rbxts/roact";
import { uiTextStrokeColor } from "client/ui/commonValues";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

interface DisplayTalismansInventoryProps {
	displayTalismansInventory: () => void;
}

/**
 * Displays the talismans inventory.
 *
 * @param props The props for the component.
 * @returns The component.
 */
export const DisplayTalismansInventory = (props: DisplayTalismansInventoryProps): Roact.Element => {
	return (
		<SpringImageButton
			native={{
				Image: assetIds.images.ui.inventory.icons.talismans,
			}}
			size={{ minSize: 0.65, maxSize: 0.75 }}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.displayTalismansInventory();
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 1),
					Size: UDim2.fromScale(0.9, 0.35),
					Text: "Talismans",
				}}
				stroke={{ native: { Thickness: 1.25, Color: uiTextStrokeColor } }}
			/>
		</SpringImageButton>
	);
};
