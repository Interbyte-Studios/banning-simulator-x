import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import assetIds from "shared/assets";

import { font, vec2Middle } from "../commonValues";
import { hooks } from "../hooks";

interface EnabledButtonProps extends Partial<WritableInstanceProperties<ImageButton>> {
	onClicked: () => void;
	minimizedSize: { x: number; y: number };
	maximizedSize: { x: number; y: number };
	isEnabled: boolean;
}

const springProps = {
	frequency: 5,
	dampingRatio: 0.5,
};

export const EnabledButton = hooks((props: EnabledButtonProps, { useEffect }) => {
	// motor
	const motor = new Flipper.GroupMotor({ x: props.maximizedSize.x, y: props.maximizedSize.y });
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
			AnchorPoint={props.AnchorPoint}
			Position={props.Position}
			Size={binding.map((value) => {
				return UDim2.fromScale(value.x, value.y);
			})}
			BackgroundTransparency={1}
			Image={props.isEnabled ? assetIds.images.buttons.On : assetIds.images.buttons.Off}
			Event={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => props.onClicked(),
				// eslint-disable-next-line jsdoc/require-jsdoc
				MouseEnter: (): void => {
					motor.setGoal({
						x: new Flipper.Spring(props.minimizedSize.x, springProps),
						y: new Flipper.Spring(props.minimizedSize.y, springProps),
					});
				},
				// eslint-disable-next-line jsdoc/require-jsdoc
				MouseLeave: (): void => {
					motor.setGoal({
						x: new Flipper.Spring(props.maximizedSize.x, springProps),
						y: new Flipper.Spring(props.maximizedSize.y, springProps),
					});
				},
			}}
		>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.95, 0.95)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={props.isEnabled ? `On` : `Off`}
				Font={font}
			>
				<uistroke
					Color={props.isEnabled ? Color3.fromRGB(111, 158, 113) : Color3.fromRGB(138, 92, 92)}
					Thickness={2.5}
				/>
			</textlabel>
		</imagebutton>
	);
});
