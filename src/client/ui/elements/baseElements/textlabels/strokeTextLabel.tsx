import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";

import { BaseUIStroke, BaseUIStrokeProps } from "../baseUIStroke";

interface StrokeTextLabelProps {
	native: Partial<WritableInstanceProperties<TextLabel>>;
	stroke: BaseUIStrokeProps;
}

/**
 * A base text label with preset properties.
 *
 * @param props The properties of the text label.
 * @returns A text label roact component with preset properties.
 */
export const StrokeTextLabel = (props: Roact.PropsWithChildren<StrokeTextLabelProps>): Roact.Element => {
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
			<BaseUIStroke {...props.stroke} />
			{props[Roact.Children]}
		</textlabel>
	);
};
