import Roact from "@rbxts/roact";

import { vec2Middle } from "../commonValues";

interface BaseImageButtonProps extends Partial<WritableInstanceProperties<ImageButton>> {
	Event?: Roact.JsxInstanceEvents<ImageButton>;
}

/* eslint-disable jsdoc/require-jsdoc */
export function BaseImageButton(props: BaseImageButtonProps): Roact.Element {
	const propsWithoutEvent: Partial<WritableInstanceProperties<ImageButton>> = props;
	// propsWithoutEvent["Event"] = undefined;

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
			{...propsWithoutEvent}
			Event={props.Event ?? {}}
		/>
	);
}
