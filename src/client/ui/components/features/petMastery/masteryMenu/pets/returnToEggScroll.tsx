// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/**
 * Allows the player to exit the pet view of pet mastery and return to egg selection.
 *
 * @param props The props for the component.
 * @param props.returnToSelection The function to call when the button is pressed.
 * @returns The element to render.
 */
export const ReturnToEggScroll = (props: { returnToSelection: () => void }): Roact.Element => {
	return (
		<SpringImageButton
			native={{
				Position: new UDim2(0.025, 0, 0.1, 0),
				Image: assetIds.images.ui.index.returnToSelection,
			}}
			size={{ minSize: 0.085, maxSize: 0.1 }}
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
