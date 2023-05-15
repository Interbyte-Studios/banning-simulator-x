import Roact from "@rbxts/roact";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/**
 * Roact imagebutton component to return to the account selection.
 *
 * @param props The props for the component.
 * @param props.returnToSelection The function to call when the button is activated.
 * @returns The Roact component.
 */
export const ReturnToAccountView = (props: { returnToSelection: () => void }): Roact.Element => {
	const minimizedSize = 0.07;
	const maximizedSize = 0.08;

	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.035, 0.2),
				Image: assetIds.images.ui.index.returnToSelection,
			}}
			size={{ maxSize: maximizedSize, minSize: minimizedSize }}
			events={{
				/* eslint-disable jsdoc/require-jsdoc */
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.returnToSelection();
				},
				/* eslint-enable jsdoc/require-jsdoc */
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</SpringImageButton>
	);
};
