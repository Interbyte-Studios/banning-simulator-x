import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

/**
 * Allows the player to exit the pet view of pet mastery and return to egg selection.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ReturnToEggScroll = hooks((props: { returnToSelection: () => void }, hooks) => {
	const minimizedSize = 0.085;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const maximizedSize = 0.1;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.025, 0.1)}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.1, value);
			})}
			Image={assetIds.images.ui.index.returnToSelection}
			Event={{
				Activated: (): void => props.returnToSelection(),
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
