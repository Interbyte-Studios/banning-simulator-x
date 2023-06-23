// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/* eslint-disable jsdoc/require-jsdoc */
export const AdminOption = hooks((props: { displayOption: () => void; header: string }) => {
	const minimizedSize = 0.8;
	const maximizedSize = 0.9;

	return (
		<BaseFrame>
			<uiaspectratioconstraint AspectRatio={5.5} />
			<BaseFrame
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(25, 101, 149)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.975, 0.9)}
			>
				<uiaspectratioconstraint AspectRatio={6} />
				<uicorner CornerRadius={new UDim(0.2, 0)} />
				<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) }} />

				<SpringImageButton
					native={{
						Image: assetIds.images.ui.index.Claim,
						Position: UDim2.fromScale(0.825, 0.5),
					}}
					size={{ maxSize: maximizedSize, minSize: minimizedSize }}
					events={{
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							props.displayOption();
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Go",
						}}
						stroke={{
							native: { Thickness: 1.5, Color: Color3.fromRGB(85, 187, 104) },
						}}
					/>
				</SpringImageButton>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.335, 0.5),
						Size: UDim2.fromScale(0.65, 0.7),
						TextXAlignment: Enum.TextXAlignment.Left,
						Text: props.header,
					}}
					stroke={{
						native: { Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) },
					}}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) }} />
				</StrokeTextLabel>
			</BaseFrame>
		</BaseFrame>
	);
});
