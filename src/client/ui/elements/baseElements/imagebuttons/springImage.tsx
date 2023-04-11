import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { hooks } from "client/ui/hooks";

interface SpringImageButtonProps {
	native: Partial<WritableInstanceProperties<ImageButton>>;
	events?: Roact.JsxInstanceEvents<ImageButton>;
	size: {
		maxSize: number;
		minSize: number;
	};
}

/**
 * @param props The properties of the image button.
 * @returns An image button roact component with preset properties.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const SpringImageButton = hooks((props: Roact.PropsWithChildren<SpringImageButtonProps>, hooks) => {
	const minimizedSize = props.size.minSize;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const maximizedSize = props.size.maxSize;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const motor = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
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
		>
			{props[Roact.Children]}
		</imagebutton>
	);
});
