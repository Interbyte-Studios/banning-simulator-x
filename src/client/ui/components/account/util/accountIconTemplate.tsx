import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";

/* eslint-disable jsdoc/require-jsdoc */
export const AccountIconTemplate = hooks(
	(
		props: { image: string; text: string; layoutOrder: number; accessibleFeature: boolean; onPressed: () => void },
		hooks,
	) => {
		const { useEffect } = hooks;

		const minimizedSize = 0.9;
		const minizmizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 1;
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
			<frame BackgroundTransparency={1} LayoutOrder={props.layoutOrder}>
				<imagebutton
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={binding.map((value) => {
						return UDim2.fromScale(value, value);
					})}
					Image={props.image}
					LayoutOrder={2}
					ImageColor3={props.accessibleFeature ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(59, 62, 60)}
					Event={{
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);

							if (props.accessibleFeature) {
								props.onPressed();
							}
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
						Text={props.text}
						Font={font}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<BaseUIStroke native={{ Thickness: 1, Color: Color3.fromRGB(0, 108, 176) }} />
					</textlabel>
					<uiaspectratioconstraint AspectRatio={1} />
				</imagebutton>
			</frame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */
