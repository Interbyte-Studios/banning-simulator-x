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

export const IncreaseButton = hooks((props: IncreaseButtonProps, { useEffect }) => {
	// springs
	const minizmizedSpring = new Flipper.Spring(props.minimizedSize, { frequency: 5 });
	const maximizedSpring = new Flipper.Spring(props.maximizedSize, { frequency: 5 });

	// motor
	const motor = new Flipper.SingleMotor(props.maximizedSize);
	const [binding, setBinding] = Roact.createBinding(motor.getValue());

	motor.onStep(setBinding);

	useEffect(() => {
		return (): void => {
			motor.destroy();
		};
	}, []);

	// component
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
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => props.onPressed(),

				// eslint-disable-next-line jsdoc/require-jsdoc
				MouseEnter: (): void => {
					motor.setGoal(minizmizedSpring);
				},

				// eslint-disable-next-line jsdoc/require-jsdoc
				MouseLeave: (): void => {
					motor.setGoal(maximizedSpring);
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</imagebutton>
	);
});
