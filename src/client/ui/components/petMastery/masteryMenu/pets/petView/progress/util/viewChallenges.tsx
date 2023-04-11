import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/**
 * A button that allows the player to view the pets of a specified variant of a specified egg.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ViewPetChallenges = hooks((props: { displayChallenges: () => void }, hooks) => {
	const minimizedSize = 0.09;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const maximizedSize = 0.1;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.9, value);
			})}
			Position={UDim2.fromScale(0.5, 0.925)}
			Image={assetIds.images.ui.index["view challenges"]}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.displayChallenges();
				},
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.9, 0.9)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Font={font}
				Text={"Challenges"}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
			>
				<BaseUIStroke native={{ Thickness: 2 }} />
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
