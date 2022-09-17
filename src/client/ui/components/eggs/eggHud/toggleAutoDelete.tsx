import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

interface ToggleAutoDeleteButtonProps {
	petsSize: number;
	displayAutoDeleteMenu: () => void;
}

/**
 * Roact imagebutton component to hatch an egg.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ToggleAutoDeleteButton = hooks((props: ToggleAutoDeleteButtonProps, hooks) => {
	const maxButtonSize = 0.1;
	const minButtonSize = 0.08;

	const maximizedSpring = new Flipper.Spring(maxButtonSize, { frequency: 5 });
	const minimizedSpring = new Flipper.Spring(minButtonSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maxButtonSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={props.petsSize <= 6 ? UDim2.fromScale(0.825, 0.6) : UDim2.fromScale(0.825, 0.55)}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.15, value);
			})}
			Image={assetIds.images.ui.egg.delete}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				Activated: (): void => props.displayAutoDeleteMenu(),
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(1, 0.4)}
				Position={UDim2.fromScale(0.5, 0.95)}
				Text={"Auto"}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Font={font}
			>
				<uistroke Color={Color3.fromRGB(122, 54, 133)} Thickness={2} />
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
