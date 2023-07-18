import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { color3White, font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

interface SpinRewardFrameProps {
	rewardType: "boost" | "pet" | "currency";
	rewardData: {
		image: string;
		amount: number;
	};
	closed: () => void;
	visible: boolean;
}

export const SpinRewardFrame = hooks((props: SpinRewardFrameProps, hooks) => {
	const normalScale = 1;
	const updatedScale = 0.9;
	const buttonSize = UDim2.fromScale(0.5, 0.18);

	const normalScaleSpring = new Flipper.Spring(normalScale);
	const updatedScaleSpring = new Flipper.Spring(updatedScale);

	const okayButton = useBindingMotor(hooks, normalScale);

	if (props.visible) {
		return (
			<imagelabel
				ZIndex={2}
				Size={UDim2.fromScale(0.335, 0.68)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Image={assetIds.images.ui.index.background}
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				<textlabel
					Key={"HEADER"}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.07)}
					Size={UDim2.fromScale(0.375, 0.1)}
					BackgroundTransparency={1}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Text={"Spin Reward"}
					Font={font}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(148, 94, 15) }} />
				</textlabel>
				<frame
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.55)}
					Size={UDim2.fromScale(0.9, 0.78)}
					BackgroundColor3={Color3.fromRGB(0, 131, 213)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(9, 95, 148) }} />
					<uicorner CornerRadius={new UDim(0.05, 0)} />
					<textlabel
						Text={"Reward Won!!"}
						TextScaled={true}
						Position={UDim2.fromScale(0.5, 0.15)}
						AnchorPoint={vec2Middle}
						Size={UDim2.fromScale(0.8, 0.2)}
						BackgroundTransparency={1}
						TextColor3={color3White}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 3, Color: Color3.fromRGB(9, 95, 148) }} />
					</textlabel>
					<imagelabel
						Position={UDim2.fromScale(0.5, 0.5)}
						AnchorPoint={vec2Middle}
						Size={UDim2.fromScale(0.4, 0.4)}
						Image={props.rewardData.image}
						ScaleType={Enum.ScaleType.Fit}
						BackgroundTransparency={1}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</imagelabel>
					<textlabel
						Text={props.rewardType === "boost" ? `15m` : `x${props.rewardData.amount}`}
						TextScaled={true}
						Position={UDim2.fromScale(0.65, 0.35)}
						AnchorPoint={vec2Middle}
						Size={UDim2.fromScale(0.2, 0.14)}
						BackgroundTransparency={1}
						Font={font}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextColor3={color3White}
					>
						<BaseUIStroke native={{ Thickness: 3, Color: Color3.fromRGB(9, 95, 148) }} />
					</textlabel>
					<imagebutton
						Position={UDim2.fromScale(0.5, 0.86)}
						Size={okayButton.binding.map((value) => {
							return UDim2.fromScale(buttonSize.X.Scale * value, buttonSize.Y.Scale * value);
						})}
						AnchorPoint={vec2Middle}
						Image={assetIds.images.buttons["long green button"]}
						ScaleType={Enum.ScaleType.Fit}
						BackgroundTransparency={1}
						Event={{
							/* eslint-disable jsdoc/require-jsdoc */
							Activated: (): void => props.closed(),
							MouseEnter: (): void => okayButton.motor.setGoal(updatedScaleSpring),
							MouseLeave: (): void => okayButton.motor.setGoal(normalScaleSpring),
							/* eslint-enable jsdoc/require-jsdoc */
						}}
					>
						<textlabel
							Text={"Okay"}
							TextScaled={true}
							Position={UDim2.fromScale(0.5, 0.5)}
							AnchorPoint={vec2Middle}
							Size={UDim2.fromScale(0.9, 0.6)}
							BackgroundTransparency={1}
							TextColor3={color3White}
							Font={font}
						>
							<BaseUIStroke
								native={{
									Thickness: 4,
									Color: Color3.fromRGB(0, 114, 33),
								}}
							/>
						</textlabel>
					</imagebutton>
				</frame>
			</imagelabel>
		);
	} else {
		return <></>;
	}
});
