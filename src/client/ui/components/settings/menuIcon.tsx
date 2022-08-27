import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { udim2Middle, vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";
import { useBindingMotor } from "client/ui/hooks/useBindingMotor";
import assetIds from "shared/assets";

interface SettingsMenuButtonProps {
	showMenu: () => void;
}

const hiddenSpring = new Flipper.Spring(0.95, { frequency: 5 });
const displayedSpring = new Flipper.Spring(1, { frequency: 5 });

/**
 * An icon image that, once clicked, will display the settings menu component.
 *
 * @param props Properties of the settings icon component.
 * @param props.showMenu A function used to hide the settings menu ui.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const SettingsMenuButton = hooks((props: SettingsMenuButtonProps, hooks) => {
	const { motor, binding } = useBindingMotor(hooks, 1);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			Position={udim2Middle}
			Size={binding.map((value) => {
				return UDim2.fromScale(value, value);
			})}
			BackgroundTransparency={1}
			Image={assetIds.images.buttons.dark.specialized.settings.Settings}
			PressedImage={assetIds.images.buttons.dark.specialized.settings["Settings Selected"]}
			HoverImage={assetIds.images.buttons.dark.specialized.settings["Settings Selected"]}
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
