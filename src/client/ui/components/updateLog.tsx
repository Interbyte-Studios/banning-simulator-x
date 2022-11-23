import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { ReplicatedStorage } from "@rbxts/services";
import assetIds from "shared/assets";

import { font, vec2Middle } from "../commonValues";
import { useBindingMotor } from "../customHooks/useBindingMotor";
import { BaseUIStroke } from "../elements/baseUIStroke";
import { ExitButton } from "../elements/exitButton";
import { hooks } from "../hooks";

const gameVersion = ReplicatedStorage.FindFirstChild("GameVersion") as StringValue;

/**
 * Documents content released in the most recent update.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const UpdateLog = hooks((props: { enabled: boolean }, hooks) => {
	if (!props.enabled) {
		return <></>;
	}

	const { useState } = hooks;
	const [isVisible, setVisibility] = useState(false);

	const maximizedSize = 0.045;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const minimizedSize = 0.038;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	if (!isVisible) {
		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.945, 0.033)}
				Size={binding.map((value) => {
					return UDim2.fromScale(0.1, value);
				})}
				Image={assetIds.images.ui["update log"]["update log"]}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: (): void => setVisibility(true),
					MouseEnter: (): void => motor.setGoal(minimizedSpring),
					MouseLeave: (): void => motor.setGoal(maximizedSpring),
				}}
			>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.575, 0.5)}
					Size={UDim2.fromScale(0.75, 0.6)}
					Text={`Update Log`}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Font={font}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(69, 69, 69) }} />
				</textlabel>
			</imagebutton>
		);
	} else {
		return (
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.3, 0.375)}
				Image={assetIds.images.ui["update log"].background}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={1.235} />
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.1)}
					Size={UDim2.fromScale(0.5, 0.15)}
					Text={`📋Update Log`}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Font={font}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(69, 69, 69) }} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.2)}
					Size={UDim2.fromScale(0.5, 0.075)}
					Text={gameVersion.Value}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Font={font}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(69, 69, 69) }} />
				</textlabel>
				<frame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.9, 0.7)}
					Position={UDim2.fromScale(0.5, 0.6)}
				>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.1)}
						Size={UDim2.fromScale(0.5, 0.15)}
						Text={`- Test`}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(69, 69, 69) }} />
					</textlabel>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.1)}
						Size={UDim2.fromScale(0.5, 0.15)}
						Text={`- Test`}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(69, 69, 69) }} />
					</textlabel>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.1)}
						Size={UDim2.fromScale(0.5, 0.15)}
						Text={`- Test`}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(69, 69, 69) }} />
					</textlabel>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.1)}
						Size={UDim2.fromScale(0.5, 0.15)}
						Text={`- Test`}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(69, 69, 69) }} />
					</textlabel>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.1)}
						Size={UDim2.fromScale(0.5, 0.15)}
						Text={`- Test`}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(69, 69, 69) }} />
					</textlabel>
					<uilistlayout
						Padding={new UDim(0.03, 0)}
						FillDirection={Enum.FillDirection.Vertical}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
					></uilistlayout>
				</frame>
				<ExitButton
					minimizedSize={0.11}
					maximizedSize={0.125}
					Position={UDim2.fromScale(0.975, 0.05)}
					onClosed={(): void => setVisibility(false)}
				/>
			</imagelabel>
		);
	}
});
