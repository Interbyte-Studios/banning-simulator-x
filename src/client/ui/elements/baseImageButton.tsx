import Roact from "@rbxts/roact";

import { vec2Middle } from "../commonValues";

interface BaseImageButtonProps extends Partial<ImageButton> {}

/* eslint-disable jsdoc/require-jsdoc */
export function BaseImageButton(props: BaseImageButtonProps): Roact.Element {
	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={props.Position}
			Size={props.Size}
			Image={props.Image}
			HoverImage={props.HoverImage}
			PressedImage={props.PressedImage}
			ScaleType={Enum.ScaleType.Fit}
			{...props}
		/>
	);
}
