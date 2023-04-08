import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";

import { vec2Middle } from "../../commonValues";
import { useBindingMotor } from "../../customHooks/useBindingMotor";
import { hooks } from "../../hooks";

interface BaseImageLabelProps {
	native: Partial<WritableInstanceProperties<ImageLabel>>;
	events?: Roact.JsxInstanceEvents<ImageLabel>;
	size?: {
		maxSize: number;
		minSize: number;
	};
}

/**
 * @param props The properties of the image label.
 * @returns An image label roact component with preset properties.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const BaseImageLabel = hooks((props: BaseImageLabelProps, hooks) => {
	if (props.size !== undefined) {
		const minimizedSize = props.size.minSize;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = props.size.maxSize;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const motor = useBindingMotor(hooks, maximizedSize);

		return (
			<imagelabel
				AnchorPoint={props.native.AnchorPoint ?? vec2Middle}
				BackgroundTransparency={props.native.BackgroundTransparency ?? 1}
				Position={props.native.Position ?? UDim2.fromScale(0.5, 0.5)}
				Size={motor.binding.map((value) => UDim2.fromScale(value, value))}
				ScaleType={props.native.ScaleType ?? Enum.ScaleType.Fit}
				{...props.native}
				Event={{
					...props.events,
					MouseEnter: (): void => motor.motor.setGoal(minimizedSpring),
					MouseLeave: (): void => motor.motor.setGoal(maximizedSpring),
				}}
			/>
		);
	} else {
		return (
			<imagelabel
				AnchorPoint={props.native.AnchorPoint ?? vec2Middle}
				BackgroundTransparency={props.native.BackgroundTransparency ?? 1}
				Position={props.native.Position ?? UDim2.fromScale(0.5, 0.5)}
				Size={props.native.Size ?? UDim2.fromScale(1, 1)}
				ScaleType={props.native.ScaleType ?? Enum.ScaleType.Fit}
				{...props}
				Event={{ ...props.events }}
			/>
		);
	}
});
/* eslint-enable jsdoc/require-jsdoc */
