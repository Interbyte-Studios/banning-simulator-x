import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

export const CompletedTask = hooks(() => {
	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
		>
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.88)}
				Size={UDim2.fromScale(0.2, 0.2)}
				Image={assetIds.images.ui.index.Claim}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={2} />
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.9, 0.9)}
					TextScaled={true}
					Font={font}
					Text={"Ok!"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(21, 167, 61) }} />
				</textlabel>
			</imagebutton>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.412)}
				Size={UDim2.fromScale(0.96, 0.123)}
				TextScaled={true}
				Font={font}
				Text={
					"All trades are final. Our moderation team will not be able to reverse any trades that have been completed."
				}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(12, 134, 211) }} />
			</textlabel>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.093)}
				Size={UDim2.fromScale(0.96, 0.119)}
				TextScaled={true}
				Font={font}
				Text={"Congratulations!"}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(12, 134, 211) }} />
			</textlabel>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.183)}
				Size={UDim2.fromScale(0.96, 0.063)}
				TextScaled={true}
				Font={font}
				Text={"Your trade is complete."}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(12, 134, 211) }} />
			</textlabel>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.587)}
				Size={UDim2.fromScale(0.96, 0.123)}
				TextScaled={true}
				Font={font}
				Text={
					"If you experience any issues, please contact our team via Discord, and we will assist as best as possible."
				}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(12, 134, 211) }} />
			</textlabel>
		</frame>
	);
});
