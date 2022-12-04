import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

interface CancelZonePurchaseProps {
	hideMenu: () => void;
}

/**
 * Ineraction UI roact component for exiting the zone prompt purchase ui.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const CancelZonePurchase = hooks((props: CancelZonePurchaseProps, hooks) => {
	const minimizedSize = 0.15;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const maximizedSize = 0.175;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.25, 0.85)}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.315, value);
			})}
			Image={assetIds.images.ui.zones.cancel}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.hideMenu();
				},
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.85, 0.6)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={"Cancel"}
				Font={font}
			>
				<BaseUIStroke native={{ Thickness: 2 }} />
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
