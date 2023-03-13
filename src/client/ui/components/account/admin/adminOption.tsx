import Flipper from "@rbxts/flipper";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/* eslint-disable jsdoc/require-jsdoc */
export const AdminOption = hooks((props: { displayOption: () => void; header: string }, hooks) => {
	const minimizedSize = 0.8;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const maximizedSize = 0.9;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const motor = useBindingMotor(hooks, maximizedSize);

	return (
		<frame BackgroundTransparency={1}>
			<uiaspectratioconstraint AspectRatio={5.5} />
			<frame
				AnchorPoint={vec2Middle}
				BackgroundColor3={Color3.fromRGB(25, 101, 149)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.975, 0.9)}
			>
				<uiaspectratioconstraint AspectRatio={6} />
				<uicorner CornerRadius={new UDim(0.2, 0)} />
				<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) }} />

				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					ScaleType={Enum.ScaleType.Fit}
					Image={assetIds.images.ui.index.Claim}
					Position={UDim2.fromScale(0.825, 0.5)}
					Size={motor.binding.map((value) => {
						return UDim2.fromScale(0.9, value);
					})}
					Event={{
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							props.displayOption();
						},
						MouseEnter: (): void => motor.motor.setGoal(minimizedSpring),
						MouseLeave: (): void => motor.motor.setGoal(maximizedSpring),
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 0.8)}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
						Font={font}
						Text={"Go"}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(85, 187, 104) }} />
					</textlabel>
				</imagebutton>

				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.335, 0.5)}
					Size={UDim2.fromScale(0.65, 0.7)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					Font={font}
					Text={props.header}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) }} />
				</textlabel>
			</frame>
		</frame>
	);
});
