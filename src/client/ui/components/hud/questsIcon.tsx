import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

interface QuestsIconProps {
	showMenu: () => void;
}

const hiddenSpring = new Flipper.Spring(0.9, { frequency: 5 });
const displayedSpring = new Flipper.Spring(1, { frequency: 5 });

/**
 * An icon image that, once clicked, will display the quests menu component.
 *
 * @param props Properties of the quests icon component.
 * @param props.showMenu A function used to hide the quests menu ui.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const QuestsIcon = hooks((props: QuestsIconProps, { useEffect }) => {
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
			Position={UDim2.fromScale(0.275, 0.5)}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.2, value);
			})}
			BackgroundTransparency={1}
			Image={'assetIds.images.buttons.icons["Quests Icon"]'}
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
