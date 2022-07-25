import Roact from "@rbxts/roact";

interface BaseUIStrokeProps extends Partial<UIStroke> {}

/**
 * @param props The properties of the ui stroke.
 * @returns A ui stroke roact component with preset properties.
 */
export function BaseUIStroke(props: BaseUIStrokeProps): Roact.Element {
	return <uistroke Color={Color3.fromRGB(20, 46, 47)} {...props} />;
}
