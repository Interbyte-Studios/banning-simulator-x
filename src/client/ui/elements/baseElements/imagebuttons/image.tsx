import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";

interface ImageButtonProps {
	native: Partial<WritableInstanceProperties<ImageButton>>;
	events?: Roact.JsxInstanceEvents<ImageButton>;
}

/**
 * A base image button with preset properties.
 *
 * @param props The properties of the image button.
 * @returns An image button roact component with preset properties.
 */
export const ImageButton = (props: Roact.PropsWithChildren<ImageButtonProps>): Roact.Element => {
	return (
		<imagebutton
			AnchorPoint={props.native.AnchorPoint ?? vec2Middle}
			BackgroundTransparency={props.native.BackgroundTransparency ?? 1}
			Position={props.native.Position ?? UDim2.fromScale(0.5, 0.5)}
			Size={props.native.Size ?? UDim2.fromScale(1, 1)}
			ScaleType={props.native.ScaleType ?? Enum.ScaleType.Fit}
			{...props.native}
			Event={{ ...(props.events ?? {}) }}
		>
			{props[Roact.Children]}
		</imagebutton>
	);
};
