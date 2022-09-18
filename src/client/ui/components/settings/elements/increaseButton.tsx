import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

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
/* eslint-disable jsdoc/require-jsdoc */
export const IncreaseButton = hooks((props: IncreaseButtonProps, hooks) => {
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
			Image={assetIds.images.buttons["forward arrow"]}
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
