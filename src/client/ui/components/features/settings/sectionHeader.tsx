import Roact from "@rbxts/roact";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";

/* eslint-disable jsdoc/require-jsdoc */
export const OptionSectionHeader = hooks((props: { yPos: number; text: string }) => {
	return (
		<StrokeTextLabel
			native={{
				Size: UDim2.fromScale(0.9, 0.018),
				Position: UDim2.fromScale(0.48, props.yPos),
				Text: props.text,
			}}
			stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) } }}
		/>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
