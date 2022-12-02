import Roact from "@rbxts/roact";
import { BSX_UIStroke } from "client/ui/elements/baseUIStroke";

import { font, vec2Middle } from "../../../commonValues";
import { hooks } from "../../../hooks";

interface SectionHeaderProps {
	position: UDim2;
	size: UDim2;
	text: string;
	strokeColor: Color3;
}

/**
 * A text label that is used to separate sections of the settings menu.
 *
 * @param props Properties of the component.
 * @param props.position The position of the component.
 * @param props.size The size of the component.
 * @param props.text The text of the component.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const SectionHeader = hooks((props: SectionHeaderProps) => {
	return (
		<textlabel
			AnchorPoint={vec2Middle}
			Position={props.position}
			Size={props.size}
			BackgroundTransparency={1}
			TextScaled={true}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			Text={props.text}
			Font={font}
		>
			<BaseUIStroke native={{ Thickness: 2, Color: props.strokeColor }} />
		</textlabel>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
