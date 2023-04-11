import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";

interface TextLabelProps {
	native: Partial<WritableInstanceProperties<TextLabel>>;
}

/**
 * A base text label with preset properties.
 *
 * @param props The properties of the text label.
 * @returns A text label roact component with preset properties.
 */
export const TextLabel = (props: Roact.PropsWithChildren<TextLabelProps>): Roact.Element => {
	return (
		<textlabel
			AnchorPoint={props.native.AnchorPoint ?? vec2Middle}
			BackgroundTransparency={props.native.BackgroundTransparency ?? 1}
			Position={props.native.Position ?? UDim2.fromScale(0.5, 0.5)}
			Size={props.native.Size ?? UDim2.fromScale(0.8, 0.8)}
			Font={font}
			TextColor3={props.native.TextColor3 ?? Color3.fromRGB(255, 255, 255)}
			TextXAlignment={props.native.TextXAlignment ?? Enum.TextXAlignment.Center}
			TextScaled={true}
			{...props.native}
		>
			{props[Roact.Children]}
		</textlabel>
	);
};
