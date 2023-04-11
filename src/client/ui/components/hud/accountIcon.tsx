import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

const minimizedSize = 0.8;
const maximizedSize = 0.9;

interface AccountIconProps {
	dispayAccount: () => void;
}

/* eslint-disable jsdoc/require-jsdoc */
export const AccountIcon = hooks((props: AccountIconProps, { useEffect }) => {
	const minizmizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const motor = new Flipper.SingleMotor(maximizedSize);
	const [binding, setBinding] = Roact.createBinding(motor.getValue());

	motor.onStep(setBinding);

	useEffect(() => {
		return (): void => {
			motor.destroy();
		};
	}, []);

	return (
		<imagebutton
			BackgroundTransparency={1}
			AnchorPoint={vec2Middle}
			Size={binding.map((value) => {
				return UDim2.fromScale(value, value);
			})}
			Image={assetIds.images.ui.hud.icons.rewards}
			LayoutOrder={2}
			Event={{
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.dispayAccount();
				},
				MouseEnter: (): void => motor.setGoal(minizmizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.9, 0.35)}
				Position={UDim2.fromScale(0.5, 1)}
				Text={"Account"}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BaseUIStroke native={{ Thickness: 1, Color: Color3.fromRGB(0, 108, 176) }} />
			</textlabel>
			<uiaspectratioconstraint AspectRatio={1} />
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
