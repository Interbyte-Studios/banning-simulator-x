// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

import { hooks } from "../../hooks";
import { SpringImageButton } from "../baseElements/imagebuttons/springImage";

interface ExitButtonProps extends Partial<WritableInstanceProperties<ImageButton>> {
	minimizedSize: number;
	maximizedSize: number;
	onClosed: () => void;
}

/**
 * A button used to exit another ui component.
 *
 * @param props Properties of the exit button component.
 * @param props.minimizedSize The minimum size of the component.
 * @param props.maximizedSize The maximum size of the component.
 * @param props.onClose A function to close out of another ui component.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ExitButton = hooks((props: ExitButtonProps) => {
	return (
		<SpringImageButton
			size={{ minSize: props.minimizedSize, maxSize: props.maximizedSize }}
			native={{
				Position: props.Position,
				Image: assetIds.images.buttons.exit,
			}}
			events={{
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.onClosed();
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</SpringImageButton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
