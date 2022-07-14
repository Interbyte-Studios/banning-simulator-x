import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import assetIds from "shared/assets";

import { font, vec2Middle } from "../commonValues";
import { hooks } from "../hooks";

interface ExitButtonProps extends Partial<WritableInstanceProperties<ImageButton>> {
	onClose: () => void;
	minimizedSize: number;
	maximimizedSize: number;
}

export const ExitButton = hooks((props: ExitButtonProps, { useEffect }) => {
	// springs
	const minizmizedSpring = new Flipper.Spring(props.minimizedSize, { frequency: 5 });
	const maximizedSpring = new Flipper.Spring(props.maximimizedSize, { frequency: 5 });

	// motor
	const motor = new Flipper.SingleMotor(props.maximimizedSize);
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
			Size={binding.map((value) => {
				return UDim2.fromScale(value, value);
			})}
			BackgroundTransparency={1}
			Image={assetIds.images.Exit}
			Event={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => props.onClose(),
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
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.95, 0.95)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={"X"}
				Font={font}
			>
				<uistroke Color={Color3.fromRGB(138, 92, 92)} Thickness={2} />
			</textlabel>
		</imagebutton>
	);
});
