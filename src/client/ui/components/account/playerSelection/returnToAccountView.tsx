import Roact from "@rbxts/roact";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/* eslint-disable jsdoc/require-jsdoc */
export const ReturnToAccountView = hooks((props: { returnToSelection: () => void }, hooks) => {
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
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.returnToSelection();
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</SpringImageButton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
