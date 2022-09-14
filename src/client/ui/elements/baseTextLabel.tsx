import Roact from "@rbxts/roact";

import { font, vec2Middle } from "../commonValues";

interface BaseTextLabelProps extends Partial<TextLabel> {}

/**
 * @param props The properties of the text label.
 * @returns A text label roact component with preset properties.
 */
export function BaseTextLabel(props: BaseTextLabelProps): Roact.Element {
	return (
		<textlabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={props.Position}
			Size={props.Size}
			Font={font}
			Text={props.Text}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			TextXAlignment={props.TextXAlignment ? props.TextXAlignment : Enum.TextXAlignment.Center}
			TextScaled={true}
			{...props}
		/>
	);
}
