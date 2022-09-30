import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

interface CancelRankUpgradeProps {
	hideMenu: () => void;
}

/* eslint-disable jsdoc/require-jsdoc */
export const CancelRankUpgrade = hooks((props: CancelRankUpgradeProps, hooks) => {
	const maximizedSize = 0.15;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const minimizedSize = 0.1;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.35, 0.85)}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.275, value);
			})}
			Image={assetIds.images.ui["rank upgrade"].cancel}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				Activated: (): void => props.hideMenu(),
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.85, 0.6)}
				Text={"Cancel"}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
				Font={font}
			>
				<uistroke Thickness={2.5} Color={Color3.fromRGB(115, 5, 5)} />
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
