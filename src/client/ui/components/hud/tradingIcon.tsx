import Roact from "@rbxts/roact";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

const minimizedSize = 0.8;
const maximizedSize = 0.9;

/* eslint-disable jsdoc/require-jsdoc */
export const TradingIcon = hooks((props: { displayTrading: () => void }) => {
	return (
		<SpringImageButton
			native={{
				Image: assetIds.images.ui.hud.icons.trading,
				LayoutOrder: 5,
			}}
			size={{
				maxSize: maximizedSize,
				minSize: minimizedSize,
			}}
			events={{
				Activated: async (): Promise<void> => {
					playSFX(UIEngagement.MinorEngagement);
					props.displayTrading();
				},
			}}
		>
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.9, 0.35),
					Position: UDim2.fromScale(0.5, 1),
					Text: "Trading",
				}}
				stroke={{
					native: { Thickness: 1, Color: Color3.fromRGB(0, 108, 176) },
				}}
			/>
			<uiaspectratioconstraint AspectRatio={1} />
		</SpringImageButton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
