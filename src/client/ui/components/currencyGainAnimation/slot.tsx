import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { hooks } from "client/ui/hooks";

interface SlotProps {
	animatedTo: UDim2;
	icon: string;
}

export const Slot = hooks((props: SlotProps, hooks) => {
	const finalPositionValue = { x: props.animatedTo.X.Scale, y: props.animatedTo.Y.Scale };

	const random = new Random();

	const randomXPosSpring = new Flipper.Spring(random.NextNumber(0.2, 0.5), { frequency: 2 });
	const randomYPosSpring = new Flipper.Spring(random.NextNumber(0.15, 0.5), { frequency: 2 });

	const finalXPosSpring = new Flipper.Spring(finalPositionValue.x, { frequency: 2 });
	const finalYPosSpring = new Flipper.Spring(finalPositionValue.y, { frequency: 2 });

	const maxSize = 0.1;
	const maximizedSizeSpring = new Flipper.Spring(maxSize, { frequency: 5 });

	const positionMotor = useBindingMotor(hooks, { x: 0.5, y: 0.5 });
	const sizeMotor = useBindingMotor(hooks, 0);

	const { useEffect } = hooks;

	useEffect(() => {
		task.defer(() => {
			task.wait(0.1);
			sizeMotor.motor.setGoal(maximizedSizeSpring);
			task.wait(0.2);
			positionMotor.motor.setGoal({ x: randomXPosSpring, y: randomYPosSpring });
			task.wait(0.23);
			positionMotor.motor.setGoal({ x: finalXPosSpring, y: finalYPosSpring });
			task.wait(0.23);
			sizeMotor.motor.setGoal(new Flipper.Spring(0));
			task.wait(1);
			positionMotor.motor.setGoal({ x: new Flipper.Spring(0.5), y: new Flipper.Spring(0.5) });
		});
	});

	return (
		<frame
			Size={sizeMotor.binding.map((value) => {
				return UDim2.fromScale(0.045, value);
			})}
			Position={positionMotor.binding.map((value) => {
				return UDim2.fromScale(value.x, value.y);
			})}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
		>
			<imagelabel
				Image={props.icon}
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</imagelabel>
		</frame>
	);
});
