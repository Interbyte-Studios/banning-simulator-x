import Roact from "@rbxts/roact";

import { vec2Middle } from "../commonValues";

interface BaseImageLabelProps extends Partial<ImageLabel> {}

/* eslint-disable jsdoc/require-jsdoc */
export function BaseImageLabel(props: BaseImageLabelProps): Roact.Element {
	return (
		<imagelabel
			AnchorPoint={props.AnchorPoint ? props.AnchorPoint : vec2Middle}
			BackgroundTransparency={1}
			Position={props.Position}
			Size={props.Size}
			Image={props.Image}
			ScaleType={props.ScaleType ? props.ScaleType : Enum.ScaleType.Fit}
			{...props}
		/>
	);
}
