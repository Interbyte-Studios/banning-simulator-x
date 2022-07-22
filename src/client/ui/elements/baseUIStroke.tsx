import Roact from "@rbxts/roact";

interface BaseUIStrokeProps extends Partial<UIStroke> {}

/* eslint-disable jsdoc/require-jsdoc */
export function BaseUIStroke(props: BaseUIStrokeProps): Roact.Element {
	return <uistroke Color={Color3.fromRGB(20, 46, 47)} {...props} />;
}
