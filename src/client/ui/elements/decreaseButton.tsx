import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import assetIds from "shared/assets";

import { vec2Middle } from "../commonValues";
import { hooks } from "../hooks";

interface DecreaseButtonProps extends Partial<WritableInstanceProperties<ImageButton>> {
	onPressed: () => void;
	minimizedSize: number;
	maximizedSize: number;
}

export const DecreaseButton = hooks((props: DecreaseButtonProps, { useEffect }) => {
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
			Size={props.Position}
			Image={assetIds.images.buttons.LeftArrow}
		/>
	);
});
