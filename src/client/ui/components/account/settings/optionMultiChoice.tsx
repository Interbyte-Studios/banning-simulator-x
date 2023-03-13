import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/* eslint-disable jsdoc/require-jsdoc */
export const OptionMultiChoice = hooks(
	(props: { header: string; context: string; yPos: number; onDecrease: () => void; onIncrease: () => void }, hooks) => {
		const minimizedSize = 0.8;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 0.9;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const decreaseMotor = useBindingMotor(hooks, maximizedSize);
		const increaseMotor = useBindingMotor(hooks, maximizedSize);

		return (
			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, props.yPos)}
				Size={UDim2.fromScale(1, 0.175)}
			>
				<uiaspectratioconstraint AspectRatio={6.5} />
				<frame
					AnchorPoint={vec2Middle}
					BackgroundColor3={Color3.fromRGB(0, 94, 153)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.95)}
				>
					<uicorner CornerRadius={new UDim(0.2, 0)} />
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 64, 102) }} />

					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.215, 0.5)}
						Size={UDim2.fromScale(0.4, 0.95)}
						Text={props.header}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextXAlignment={Enum.TextXAlignment.Left}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
					</textlabel>

					<imagebutton
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.58, 0.5)}
						Size={decreaseMotor.binding.map((value) => {
							return UDim2.fromScale(0.29, value);
						})}
						Image={assetIds.images.buttons["back arrow"]}
						ScaleType={Enum.ScaleType.Fit}
						Event={{
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								props.onDecrease();
							},
							MouseEnter: (): void => decreaseMotor.motor.setGoal(minimizedSpring),
							MouseLeave: (): void => decreaseMotor.motor.setGoal(maximizedSpring),
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</imagebutton>

					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.75, 0.5)}
						Size={UDim2.fromScale(0.2, 0.95)}
						Text={props.context}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
					</textlabel>

					<imagebutton
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.915, 0.5)}
						Size={increaseMotor.binding.map((value) => {
							return UDim2.fromScale(0.29, value);
						})}
						Image={assetIds.images.buttons["forward arrow"]}
						ScaleType={Enum.ScaleType.Fit}
						Event={{
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								props.onIncrease();
							},
							MouseEnter: (): void => increaseMotor.motor.setGoal(minimizedSpring),
							MouseLeave: (): void => increaseMotor.motor.setGoal(maximizedSpring),
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</imagebutton>
				</frame>
			</frame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */
