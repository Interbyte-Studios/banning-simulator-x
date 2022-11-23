import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";

interface ProgressHeaderProps {
	text: string;
	position: UDim2;
}

/**
 * @param props The properties of the Roact component.
 * @param props.text The header text to display.
 * @param props.position The position of the header.
 * @returns A Roact component.
 */
export function ProgressHeader(props: ProgressHeaderProps): Roact.Element {
	return (
		<textlabel
			BackgroundTransparency={1}
			AnchorPoint={vec2Middle}
			Size={UDim2.fromScale(0.6, 0.1)}
			Position={props.position}
			Font={font}
			Text={props.text}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			TextScaled={true}
			TextXAlignment={Enum.TextXAlignment.Left}
		>
			<BaseUIStroke native={{ Thickness: 2 }} />
		</textlabel>
	);
}
