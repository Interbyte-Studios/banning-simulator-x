import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { EggName } from "shared/configs/eggs";

/**
 * Allows the player to view information about a specific egg.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ViewEgg = hooks((props: { eggName: EggName }, hooks) => {
	const maximizedSize = 0.225;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const minimizedSize = 0.2;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.2, value);
			})}
			Position={UDim2.fromScale(0.12, 0.9)}
			Image={assetIds.images.ui["weapon shop"]["purchase button"]}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				Activated: (): void => {},
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={3.3} />
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.9, 0.9)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={`View`}
				Font={font}
			>
				<BaseUIStroke Thickness={2} />
			</textlabel>
		</imagebutton>
	);
});
