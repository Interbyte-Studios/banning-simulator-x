import Roact from "@rbxts/roact";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/* eslint-disable jsdoc/require-jsdoc */
export const OptionChoice = hooks(
	(props: { header: string; enabled: boolean; yPos: number; onPressed: () => void }) => {
		const minimizedSize = 0.8;
		const maximizedSize = 0.9;

		return (
			<BaseFrame Position={UDim2.fromScale(0.5, props.yPos)} Size={UDim2.fromScale(1, 0.175)}>
				<uiaspectratioconstraint AspectRatio={6.5} />
				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(0, 94, 153)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.95)}
				>
					<uicorner CornerRadius={new UDim(0.2, 0)} />
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 64, 102) }} />

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.365, 0.5),
							Size: UDim2.fromScale(0.7, 0.6),
							Text: props.header,
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{
							native: { Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) },
						}}
					/>

					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.85, 0.5),
							Image: props.enabled ? assetIds.images.ui.index.Claim : assetIds.images.ui.index.Off,
						}}
						size={{ maxSize: maximizedSize, minSize: minimizedSize }}
						events={{
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								props.onPressed();
							},
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />
						<StrokeTextLabel
							native={{
								Size: UDim2.fromScale(0.9, 0.9),
								Text: props.enabled ? "On" : "Off",
							}}
							stroke={{
								native: {
									Thickness: 1.5,
									Color: props.enabled ? Color3.fromRGB(36, 159, 66) : Color3.fromRGB(106, 14, 46),
								},
							}}
						></StrokeTextLabel>
					</SpringImageButton>
				</BaseFrame>
			</BaseFrame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */
