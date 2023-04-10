import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";

import { useBindingMotor } from "../../../customHooks/useBindingMotor";
import { hooks } from "../../../hooks";
import { ImageLabel } from "./image";

interface SpringImageProps {
	native: Omit<Partial<WritableInstanceProperties<ImageLabel>>, "Size">;
	events?: Omit<Roact.JsxInstanceEvents<ImageLabel>, "MouseEnter" | "MouseLeave">;
	size: {
		maxSize: number;
		minSize: number;
	};
}

/**
 * @param props The properties of the image label that uses a motor to size itself.
 * @returns An image label roact component with preset properties.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const SpringImageLabel = hooks((props: Roact.PropsWithChildren<SpringImageProps>, hooks) => {
	const { minSize, maxSize } = props.size;
	const minSizeSpring = new Flipper.Spring(minSize, { frequency: 5 });
	const maxSizeSpring = new Flipper.Spring(maxSize, { frequency: 5 });

	const { motor: sizeMotor, binding: sizeBinding } = useBindingMotor(hooks, maxSize);

	return (
		<ImageLabel
			native={{ ...props.native, Size: sizeBinding.map((value) => UDim2.fromScale(value, value)) }}
			events={{
				...props.events,
				MouseEnter: (): void => sizeMotor.setGoal(minSizeSpring),
				MouseLeave: (): void => sizeMotor.setGoal(maxSizeSpring),
			}}
		>
			{props[Roact.Children]}
		</ImageLabel>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
