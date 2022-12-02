import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BSX_UIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

const maximizedSize = 0.1;
const minimizedSize = 0.075;

/* eslint-disable jsdoc/require-jsdoc */
export const DiscordRewards = hooks((_, hooks) => {
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.875)}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.25, value);
			})}
			Image={assetIds.images.buttons["long green button"]}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.8, 0.6)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={"Verified"}
				Font={font}
			>
				<BaseUIStroke native={{ Thickness: 1.2 }} />
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
