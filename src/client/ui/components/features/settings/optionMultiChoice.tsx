import Roact from "@rbxts/roact";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/* eslint-disable jsdoc/require-jsdoc */
export const OptionMultiChoice = hooks(
	(props: { header: string; context: string; yPos: number; onDecrease: () => void; onIncrease: () => void }) => {
		const minimizedSize = 0.8;
		const maximizedSize = 0.9;

		return (
			<BaseFrame Position={UDim2.fromScale(0.48, props.yPos)} Size={UDim2.fromScale(1, 0.175)}>
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
							Position: UDim2.fromScale(0.215, 0.5),
							Size: UDim2.fromScale(0.4, 0.95),
							TextXAlignment: Enum.TextXAlignment.Left,
							Text: props.header,
						}}
						stroke={{
							native: { Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) },
						}}
					/>

					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.58, 0.5),
							Image: assetIds.images.buttons["back arrow"],
						}}
						size={{ maxSize: maximizedSize, minSize: minimizedSize }}
						events={{
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								props.onDecrease();
							},
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</SpringImageButton>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.75, 0.5),
							Size: UDim2.fromScale(0.2, 0.95),
							Text: props.context,
						}}
						stroke={{
							native: { Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) },
						}}
					/>

					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.915, 0.5),
							Image: assetIds.images.buttons["forward arrow"],
						}}
						size={{ maxSize: maximizedSize, minSize: minimizedSize }}
						events={{
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								props.onIncrease();
							},
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</SpringImageButton>
				</BaseFrame>
			</BaseFrame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */
