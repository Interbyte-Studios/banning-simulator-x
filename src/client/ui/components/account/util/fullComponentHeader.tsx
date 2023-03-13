import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/* eslint-disable jsdoc/require-jsdoc */
export const FullComponentHeader = hooks(
	(
		props: { storeFound: boolean; headerText: string; displayReturn: boolean; returnToSelection: () => void },
		hooks,
	) => {
		if (!props.displayReturn && props.storeFound) {
			return (
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.4, 0.1)}
					Position={UDim2.fromScale(0.75, 0.215)}
					Text={props.headerText}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Font={font}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
				</textlabel>
			);
		} else if (props.storeFound) {
			const minimizedSize = 0.07;
			const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

			const maximizedSize = 0.08;
			const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

			const { motor, binding } = useBindingMotor(hooks, maximizedSize);
			return (
				<>
					<imagebutton
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.05, 0.215)}
						Size={binding.map((value) => {
							return UDim2.fromScale(0.1, value);
						})}
						Image={assetIds.images.ui.index.returnToSelection}
						Event={{
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								props.returnToSelection();
							},
							MouseEnter: (): void => motor.setGoal(minimizedSpring),
							MouseLeave: (): void => motor.setGoal(maximizedSpring),
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</imagebutton>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Size={UDim2.fromScale(0.8, 0.065)}
						Position={UDim2.fromScale(0.5, 0.215)}
						Text={props.headerText}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
					</textlabel>
				</>
			);
		} else {
			const minimizedSize = 0.1;
			const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

			const maximizedSize = 0.125;
			const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

			const { motor, binding } = useBindingMotor(hooks, maximizedSize);
			return (
				<>
					<imagebutton
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.725, 0.625)}
						Size={binding.map((value) => {
							return UDim2.fromScale(value, 0.6);
						})}
						Image={assetIds.images.ui.index.Claim}
						Event={{
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								props.returnToSelection();
							},
							MouseEnter: (): void => motor.setGoal(minimizedSpring),
							MouseLeave: (): void => motor.setGoal(maximizedSpring),
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />
						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Size={UDim2.fromScale(0.8, 0.8)}
							Position={UDim2.fromScale(0.5, 0.5)}
							Text={"Return"}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Font={font}
						>
							<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 87, 13) }} />
						</textlabel>
					</imagebutton>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Size={UDim2.fromScale(0.535, 0.1)}
						Position={UDim2.fromScale(0.725, 0.5)}
						Text={props.headerText}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
					</textlabel>
				</>
			);
		}
	},
);
/* eslint-enable jsdoc/require-jsdoc */
