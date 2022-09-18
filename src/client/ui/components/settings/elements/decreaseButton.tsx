import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import assetIds from "shared/assets";

import { vec2Middle } from "../../../commonValues";
import { useBindingMotor } from "../../../customHooks/useBindingMotor";
import { hooks } from "../../../hooks";

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
/* eslint-disable jsdoc/require-jsdoc */
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
			Image={assetIds.images.buttons["back arrow"]}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				Activated: (): void => props.onPressed(),
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
