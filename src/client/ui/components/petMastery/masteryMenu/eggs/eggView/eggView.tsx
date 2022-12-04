import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { getEggImage } from "client/util/getEggImage";
import { playSFX, UIEngagement } from "client/util/playSound";
import { EggName } from "shared/configs/eggs";

/**
 * A decal of the egg being viewed in the pet mastery component.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const EggView = hooks((props: { egg: EggName; hideInfo: () => void; isDiscovered: boolean }, hooks) => {
	const raisedPosition = 0.4;
	const raisedSpring = new Flipper.Spring(raisedPosition, { frequency: 5 });

	const normalPosition = 0.5;
	const normalSpring = new Flipper.Spring(normalPosition, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, normalPosition);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={0}
			Position={UDim2.fromScale(0.225, 0.2)}
			Size={UDim2.fromScale(0.4, 1.2)}
			BackgroundColor3={Color3.fromRGB(0, 131, 213)}
			Image={""}
			Event={{
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.hideInfo();
				},
				MouseEnter: (): void => motor.setGoal(raisedSpring),
				MouseLeave: (): void => motor.setGoal(normalSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<uicorner CornerRadius={new UDim(1, 0)} />
			<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />

			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.9, 0.9)}
				Position={binding.map((value) => {
					return UDim2.fromScale(0.5, value);
				})}
				Image={getEggImage(props.egg)}
				ScaleType={Enum.ScaleType.Fit}
				ImageColor3={props.isDiscovered ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(0, 0, 0)}
			/>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
