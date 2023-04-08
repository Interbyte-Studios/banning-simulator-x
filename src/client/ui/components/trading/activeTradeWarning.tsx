// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

/* eslint-disable jsdoc/require-jsdoc */
export const ActiveTradeWarning = hooks((props: { player: Player; hideMenu: () => void }) => {
	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(0.975, 0.9)}
		>
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.9)}
				Size={UDim2.fromScale(0.3, 0.3)}
				Image={assetIds.images.ui.index.Claim}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={2} />
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.8, 0.8)}
					Text={"Ok!"}
					Font={font}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(27, 156, 91) }} />
				</textlabel>
			</imagebutton>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.426)}
				Size={UDim2.fromScale(0.95, 0.311)}
				Font={font}
				Text={`That player is currently in an active trade, or someone else has requested to trade with them. Please wait until they are done trading.`}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
			>
				<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 75, 122) }} />
			</textlabel>
		</frame>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
