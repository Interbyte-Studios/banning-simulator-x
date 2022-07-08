import Roact from "@rbxts/roact";

import { udim2Middle, vec2Middle } from "../commonValues";

type BaseImageLabelProps = Omit<
	Partial<WritableInstanceProperties<ImageLabel>>,
	"BackgroundTransparency" | "ScaleType"
>;

/* eslint-disable jsdoc/require-jsdoc */
export function BaseImageLabel(props: BaseImageLabelProps): Roact.Element {
	return (
		<imagelabel
			AnchorPoint={props.AnchorPoint ? props.AnchorPoint : vec2Middle}
			BackgroundTransparency={1}
			Position={props.Position ? props.Position : udim2Middle}
			Size={props.Size}
			Image={props.Image}
			ScaleType={Enum.ScaleType.Fit}
			{...props}
		/>
	);
}
