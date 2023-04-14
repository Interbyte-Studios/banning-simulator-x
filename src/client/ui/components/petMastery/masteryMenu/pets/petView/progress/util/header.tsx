import Roact from "@rbxts/roact";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";

interface ProgressHeaderProps {
	text: string;
}

/**
 * @param props The properties of the Roact component.
 * @param props.text The header text to display.
 * @param props.position The position of the header.
 * @returns A Roact component.
 */
export function ProgressHeader(props: ProgressHeaderProps): Roact.Element {
	return (
		<StrokeTextLabel
			native={{
				Size: UDim2.fromScale(0.9, 0.1),
				Position: UDim2.fromScale(0.5, 0.725),
				Text: props.text,
				TextXAlignment: Enum.TextXAlignment.Left,
			}}
			stroke={{ native: { Thickness: 2 } }}
		/>
	);
}
