import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";

/* eslint-disable jsdoc/require-jsdoc */
export const OptionSectionHeader = hooks((props: { yPos: number; text: string }) => {
	return (
		<textlabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.9, 0.018)}
			Position={UDim2.fromScale(0.5, props.yPos)}
			Font={font}
			Text={props.text}
			TextScaled={true}
			TextColor3={Color3.fromRGB(255, 255, 255)}
		>
			<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
		</textlabel>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
