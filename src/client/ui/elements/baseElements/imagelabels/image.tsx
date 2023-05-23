import Roact from "@rbxts/roact";

import { vec2Middle } from "../../../commonValues";

interface ImageProps {
	native: Partial<{
		// allow both the normal type and the binding variant
		[K in keyof WritableInstanceProperties<ImageLabel>]:
			| WritableInstanceProperties<ImageLabel>[K]
			| Roact.Binding<WritableInstanceProperties<ImageLabel>[K]>;
	}>;
	events?: Roact.JsxInstanceEvents<ImageLabel>;
}

/**
 * @param props The properties of the image label.
 * @returns An image label roact component with preset properties.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ImageLabel = (props: Roact.PropsWithChildren<ImageProps>): Roact.Element => {
	return (
		<imagelabel
			AnchorPoint={props.native.AnchorPoint ?? vec2Middle}
			BackgroundTransparency={props.native.BackgroundTransparency ?? 1}
			Position={props.native.Position ?? UDim2.fromScale(0.5, 0.5)}
			Size={props.native.Size ?? UDim2.fromScale(1, 1)}
			ScaleType={props.native.ScaleType ?? Enum.ScaleType.Fit}
			{...props.native}
			Event={{ ...props.events }}
		>
			{props[Roact.Children]}
		</imagelabel>
	);
};
/* eslint-enable jsdoc/require-jsdoc */
