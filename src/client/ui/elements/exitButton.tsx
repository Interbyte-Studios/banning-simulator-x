import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import assetIds from "shared/assets";

import { font, vec2Middle } from "../commonValues";
import { useBindingMotor } from "../customHooks/useBindingMotor";
import { hooks } from "../hooks";

interface ExitButtonProps extends Partial<WritableInstanceProperties<ImageButton>> {
	minimizedSize: number;
	maximizedSize: number;
	onClosed: () => void;
}

/**
 * A button used to exit another ui component.
 *
 * @param props Properties of the exit button component.
 * @param props.minimizedSize The minimum size of the component.
 * @param props.maximizedSize The maximum size of the component.
 * @param props.onClose A function to close out of another ui component.
 */
export const ExitButton = hooks((props: ExitButtonProps, hooks) => {
	const minimizedSpring = new Flipper.Spring(props.minimizedSize, { frequency: 5 });
	const maximizedSpring = new Flipper.Spring(props.maximizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, props.maximizedSize);

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
				/**
				 * Event that connects to the `onClosed` function prop.
				 *
				 * @returns Nothing.
				 */
				Activated: (): void => props.onClosed(),

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
