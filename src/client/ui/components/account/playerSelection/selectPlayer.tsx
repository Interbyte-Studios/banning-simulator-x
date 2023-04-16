import Roact from "@rbxts/roact";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/* eslint-disable jsdoc/require-jsdoc */
export const SelectPlayer = hooks((props: { setPlayerSelectionVisibility: () => void }) => {
	const minimizedSize = 0.2;
	const maximizedSize = 0.25;

	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.225, 0.2),
				Image: assetIds.images.ui.equip.toolTp,
			}}
			size={{ maxSize: maximizedSize, minSize: minimizedSize }}
			events={{
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.setPlayerSelectionVisibility();
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={3.5} />
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.9, 0.9),
					Text: "Select Player",
				}}
				stroke={{
					native: { Thickness: 1, Color: Color3.fromRGB(0, 84, 176) },
				}}
			/>
		</SpringImageButton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
