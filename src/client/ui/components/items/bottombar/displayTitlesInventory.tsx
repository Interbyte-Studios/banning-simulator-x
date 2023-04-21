import Roact from "@rbxts/roact";
import { uiTextStrokeColor } from "client/ui/commonValues";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

interface DisplayTitlesInventoryProps {
	displayTitlesInventory: () => void;
}

/**
 * Displays the titles inventory.
 *
 * @param props The props for the component.
 * @returns The component.
 */
export const DisplayTitlesInventory = (props: DisplayTitlesInventoryProps): Roact.Element => {
	return (
		<SpringImageButton
			native={{
				Image: assetIds.images.ui.inventory.icons.titles,
			}}
			size={{ minSize: 0.825, maxSize: 0.9 }}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.displayTitlesInventory();
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 1),
					Size: UDim2.fromScale(0.9, 0.35),
					Text: "Titles",
				}}
				stroke={{ native: { Thickness: 1.25, Color: uiTextStrokeColor } }}
			/>
		</SpringImageButton>
	);
};
