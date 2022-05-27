import Roact from "@rbxts/roact";

import { font, uiTheme, vec2Middle } from "../commonValues";

interface BaseTextLabelProps extends Partial<TextLabel> {}

/* eslint-disable jsdoc/require-jsdoc */
export function BaseTextLabel(props: BaseTextLabelProps): Roact.Element {
	return (
		<textlabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={props.Position}
			Size={props.Size}
			Font={font}
			Text={props.Text}
			TextColor3={
				props.TextColor3 !== undefined
					? props.TextColor3
					: uiTheme === "dark"
					? Color3.fromRGB(255, 255, 255)
					: Color3.fromRGB(17, 17, 17)
			}
			TextXAlignment={props.TextXAlignment ? props.TextXAlignment : Enum.TextXAlignment.Center}
			TextScaled={true}
			{...props}
		/>
	);
}
