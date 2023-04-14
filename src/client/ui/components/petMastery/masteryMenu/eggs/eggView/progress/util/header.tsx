import Roact from "@rbxts/roact";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { VariantGradient } from "client/ui/elements/gradients/variantGradient";
import { Variants } from "shared/configs/pets";

interface ProgressHeaderProps {
	text: string;
	position: UDim2;
	variant: Variants;
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
				Size: UDim2.fromScale(0.6, 0.1),
				Position: props.position,
				Text: props.text,
				TextXAlignment: Enum.TextXAlignment.Left,
			}}
			stroke={{ native: { Thickness: 2 } }}
		>
			<VariantGradient variant={props.variant} />
		</StrokeTextLabel>
	);
}
