// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/**
 * A button that returns the player to the world selection screen.
 *
 * @param props - The props for the component.
 * @param props.returnToSelection - A callback that returns the player to the world selection screen.
 * @returns A Roact element that represents the button.
 */
export const ReturnToWorldSelection = (props: { returnToSelection: () => void }): Roact.Element => {
	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.25, 0.2),
				Image: assetIds.images.ui.index.returnToSelection,
			}}
			size={{ minSize: 0.06, maxSize: 0.075 }}
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
