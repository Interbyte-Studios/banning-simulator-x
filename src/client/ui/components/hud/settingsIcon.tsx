import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { udim2Middle, vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

interface SettingsIconProps {
	showMenu: () => void;
}

const hiddenSpring = new Flipper.Spring(0.9, { frequency: 5 });
const displayedSpring = new Flipper.Spring(1, { frequency: 5 });

/**
 * An icon image that, once clicked, will display the settings menu component.
 *
 * @param props Properties of the settings icon component.
 * @param props.showMenu A function used to hide the settings menu ui.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const SettingsIcon = hooks((props: SettingsIconProps, { useEffect }) => {
	const motor = new Flipper.SingleMotor(1);
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
			Position={udim2Middle}
			Size={binding.map((value) => {
				return UDim2.fromScale(value, value);
			})}
			BackgroundTransparency={1}
			Image={assetIds.images.buttons.icons["Settings Icon"]}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				Activated: (): void => props.showMenu(),
				MouseEnter: (): void => {
					motor.setGoal(hiddenSpring);
				},
				MouseLeave: (): void => {
					motor.setGoal(displayedSpring);
				},
			}}
		/>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
