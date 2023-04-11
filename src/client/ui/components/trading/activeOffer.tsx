// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import {
	font,
	uiClaimButtonStrokeColor,
	uiOffButtonStrokeColor,
	uiTextStrokeColor,
	vec2Middle,
} from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import assetIds from "shared/assets";

/**
 * Displays the offer for the currency being traded.
 *
 * @returns The Roact element to render.
 */
export const CurrencyOffer = (): Roact.Element => {
	return (
		<BaseFrame
			BackgroundTransparency={0}
			BackgroundColor3={Color3.fromRGB(12, 134, 211)}
			Position={UDim2.fromScale(0.275, 0.915)}
			Size={UDim2.fromScale(0.5, 0.09)}
		>
			<uicorner CornerRadius={new UDim(0.2, 0)} />
			<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(9, 96, 150) }} />

			<textbox
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.55, 0.5)}
				Size={UDim2.fromScale(0.8, 0.8)}
				Font={font}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={""}
				PlaceholderColor3={Color3.fromRGB(255, 255, 255)}
				PlaceholderText={"Enter amount: (Ex: 500k)"}
				TextXAlignment={Enum.TextXAlignment.Left}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: uiTextStrokeColor }} />
			</textbox>

			<CurrencyIcon
				anchorPoint={vec2Middle}
				position={UDim2.fromScale(0.065, 0)}
				size={{ minimizedSize: 0.9, maximizedSize: 1 }}
				currency={"coins"}
			/>
		</BaseFrame>
	);
};

/**
 * Displays the offer for the local player.
 *
 * @returns The Roact element to render.
 */
export const LocalOffer = (): Roact.Element => {
	return (
		<>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.095, 0),
					Size: UDim2.fromScale(0.35, 0.1),
					Text: "Your Offer",
				}}
				stroke={{ native: { Color: uiTextStrokeColor, Thickness: 2 } }}
			/>

			<BaseFrame Position={UDim2.fromScale(0.275, 0.45)} Size={UDim2.fromScale(0.485, 0.79)}>
				<uicorner CornerRadius={new UDim(0.125, 0)} />
				<BaseUIStroke native={{ Color: uiTextStrokeColor, Thickness: 4 }} />

				<scrollingframe
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.52)}
					Size={UDim2.fromScale(0.99, 0.915)}
					ScrollBarImageColor3={uiTextStrokeColor}
				></scrollingframe>
			</BaseFrame>
		</>
	);
};

/**
 * Displays the offer for the other player.
 *
 * @returns The Roact element to render.
 */
export const TheirOffer = (): Roact.Element => {
	return (
		<>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.585, 0),
					Size: UDim2.fromScale(0.35, 0.1),
					Text: "Their Offer",
				}}
				stroke={{ native: { Color: uiTextStrokeColor, Thickness: 2 } }}
			/>

			<BaseFrame Position={UDim2.fromScale(0.76, 0.375)} Size={UDim2.fromScale(0.43, 0.63)}>
				<uicorner CornerRadius={new UDim(0.125, 0)} />
				<BaseUIStroke native={{ Color: Color3.fromRGB(12, 134, 211), Thickness: 4 }} />

				<scrollingframe
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.52)}
					Size={UDim2.fromScale(0.99, 0.915)}
					ScrollBarImageColor3={Color3.fromRGB(8, 82, 129)}
				></scrollingframe>
			</BaseFrame>
		</>
	);
};

/**
 * Displays the active offer.
 *
 * @returns The Roact element to render.
 */
export const ActiveOffer = (): Roact.Element => {
	return (
		<BaseFrame Size={UDim2.fromScale(1, 1)}>
			<CurrencyOffer />
			<LocalOffer />
			<TheirOffer />

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.765, 0.755),
					Size: UDim2.fromScale(0.44, 0.1),
					Text: "All trades are final. Be careful and mindful when trading others.",
				}}
				stroke={{ native: { Color: uiTextStrokeColor, Thickness: 2 } }}
			/>

			<ImageButton
				native={{
					Position: UDim2.fromScale(0.88, 0.89),
					Size: UDim2.fromScale(0.2, 0.2),
					Image: assetIds.images.ui.index.Claim,
				}}
			>
				<uiaspectratioconstraint AspectRatio={2} />

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.9),
						Text: "Confirm",
					}}
					stroke={{ native: { Color: uiClaimButtonStrokeColor, Thickness: 2 } }}
				/>
			</ImageButton>

			<ImageButton
				native={{
					Position: UDim2.fromScale(0.88, 0.89),
					Size: UDim2.fromScale(0.2, 0.2),
					Image: assetIds.images.ui.index.Off,
				}}
			>
				<uiaspectratioconstraint AspectRatio={2} />

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.9),
						Text: "Cancel",
					}}
					stroke={{ native: { Color: uiOffButtonStrokeColor, Thickness: 2 } }}
				/>
			</ImageButton>
		</BaseFrame>
	);
};
