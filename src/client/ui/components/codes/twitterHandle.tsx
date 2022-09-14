import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

export const TwitterHandle = hooks(() => {
	return (
		<>
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.375, 0.45)}
				Size={UDim2.fromScale(0.65, 0.125)}
				Image={assetIds.images.ui.codes.input}
				ScaleType={Enum.ScaleType.Fit}
			>
				<textbox
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.5)}
					PlaceholderText={"Input Twitter Handle"}
					PlaceholderColor3={Color3.fromRGB(255, 255, 255)}
					Text={""}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Font={font}
					TextScaled={true}
				>
					<BaseUIStroke Thickness={1.2} />
				</textbox>
			</imagelabel>
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.84, 0.45)}
				Size={UDim2.fromScale(0.25, 0.1)}
				Image={assetIds.images.buttons["long green button"]}
				ScaleType={Enum.ScaleType.Fit}
			>
				<textlabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.8, 0.6)}
					BackgroundTransparency={1}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Text={"Verify"}
					Font={font}
				>
					<BaseUIStroke Thickness={1.2} />
				</textlabel>
			</imagebutton>
		</>
	);
});
