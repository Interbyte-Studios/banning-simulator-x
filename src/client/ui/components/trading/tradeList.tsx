import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { RescalingScrollingFrame } from "client/ui/elements/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

export const TradeCard = hooks(() => {
	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundColor3={Color3.fromRGB(0, 100, 163)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 0.95)}
		>
			<uiaspectratioconstraint AspectRatio={5.6} />
			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 0.95)}
			>
				<uicorner CornerRadius={new UDim(0.3, 0)} />
				<frame
					AnchorPoint={vec2Middle}
					BackgroundColor3={Color3.fromRGB(44, 170, 249)}
					Position={UDim2.fromScale(0.09, 0.5)}
					Size={UDim2.fromScale(0.8, 0.8)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 75, 122) }} />
				</frame>
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.85, 0.5)}
					Size={UDim2.fromScale(0.7, 0.7)}
					Image={assetIds.images.ui.index.Claim}
					ScaleType={Enum.ScaleType.Fit}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 0.8)}
						Font={font}
						Text={"Trade."}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(17, 150, 55) }} />
					</textlabel>
				</imagebutton>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.425, 0.5)}
					Size={UDim2.fromScale(0.5, 0.6)}
					Font={font}
					Text={"Player Name"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(17, 150, 55) }} />
				</textlabel>
			</frame>
		</frame>
	);
});

export const TradeList = hooks(() => {
	return (
		<RescalingScrollingFrame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(0.975, 0.9)}
			ScrollingDirection={Enum.ScrollingDirection.Y}
		>
			<uilistlayout />
		</RescalingScrollingFrame>
	);
});
