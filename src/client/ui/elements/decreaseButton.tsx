import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import assetIds from "shared/assets";

import { vec2Middle } from "../commonValues";
import { hooks } from "../hooks";
import { useBindingMotor } from "../hooks/useBindingMotor";

interface DecreaseButtonProps extends Partial<WritableInstanceProperties<ImageButton>> {
	minimizedSize: number;
	maximizedSize: number;
	onPressed: () => void;
}

/**
 * A button used to decrease the value of something.
 *
 * @param props Properties of the decrease button component.
 * @param props.minimizedSize The minimum size of the component.
 * @param props.maximizedSize The maximum size of the component.
 * @param props.onPressed A function used to decrease the value.
 */
export const DecreaseButton = hooks((props: DecreaseButtonProps, hooks) => {
	const minimizedSpring = new Flipper.Spring(props.minimizedSize, { frequency: 5 });
	const maximizedSpring = new Flipper.Spring(props.maximizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, props.maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			Position={props.Position}
			BackgroundTransparency={1}
			Size={binding.map((value) => {
				return UDim2.fromScale(value, value);
			})}
			Image={assetIds.images.buttons.LeftArrow}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				/**
				 * Event that connects to the `onPressed` function prop.
				 *
				 * @returns Nothing.
				 */
				Activated: (): void => props.onPressed(),

				/**
				 * Event that connects to the motors `setGoal` method.
				 *
				 * @returns Nothing.
				 */
				MouseEnter: (): void => motor.setGoal(minimizedSpring),

				/**
				 * Event that connects to the motors `setGoal` method.
				 *
				 * @returns Nothing.
				 */
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</imagebutton>
	);
});
