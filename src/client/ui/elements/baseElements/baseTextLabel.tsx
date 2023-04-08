import Roact from "@rbxts/roact";

import { font, vec2Middle } from "../../commonValues";
import { BaseUIStroke, BaseUIStrokeProps } from "./baseUIStroke";

interface BaseTextLabelProps {
	native: Partial<WritableInstanceProperties<TextLabel>>;
	stroke?: BaseUIStrokeProps;
}

/**
 * @param props The properties of the text label.
 * @returns A text label roact component with preset properties.
 */
export function BaseTextLabel(props: BaseTextLabelProps): Roact.Element {
	if (props.stroke !== undefined) {
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
			</textlabel>
		);
	} else {
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
			/>
		);
	}
}
