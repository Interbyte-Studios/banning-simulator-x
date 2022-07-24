import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import assetIds from "shared/assets";

import { vec2Middle } from "../commonValues";
import { hooks } from "../hooks";

interface IncreaseButtonProps extends Partial<WritableInstanceProperties<ImageButton>> {
	onPressed: () => void;
	minimizedSize: number;
	maximizedSize: number;
}

/**
 * A button used to increase the value of something.
 *
 * @param props Properties of the increase button component.
 * @param props.minimizedSize The minimum size of the component.
 * @param props.maximizedSize The maximum size of the component.
 * @param props.onPressed A function used to increase the value.
 */
export const IncreaseButton = hooks((props: IncreaseButtonProps, { useEffect }) => {
	const minizmizedSpring = new Flipper.Spring(props.minimizedSize, { frequency: 5 });
	const maximizedSpring = new Flipper.Spring(props.maximizedSize, { frequency: 5 });

	const motor = new Flipper.SingleMotor(props.maximizedSize);
	const [binding, setBinding] = Roact.createBinding(motor.getValue());

	motor.onStep(setBinding);

	useEffect(() => {
		return (): void => {
			motor.destroy();
		};
	}, []);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			Position={props.Position}
			BackgroundTransparency={1}
			Size={binding.map((value) => {
				return UDim2.fromScale(value, value);
			})}
			Image={assetIds.images.buttons.RightArrow}
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
				MouseEnter: (): void => motor.setGoal(minizmizedSpring),

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
