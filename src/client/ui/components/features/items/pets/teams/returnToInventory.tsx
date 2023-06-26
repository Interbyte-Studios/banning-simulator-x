import Roact from "@rbxts/roact";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/**
 * Allows the player to exit the pet team view.
 *
 * @param props The props for the component.
 * @param props.returnToSelection The function to call when the player wants to return to the pet selection.
 * @returns The component.
 */
export const ReturnToPetInventory = (props: { returnToSelection: () => void }): Roact.Element => {
	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.025, 0.11),
				Image: assetIds.images.ui.index.returnToSelection,
			}}
			size={{ minSize: 0.06, maxSize: 0.08 }}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.returnToSelection();
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</SpringImageButton>
	);
};
