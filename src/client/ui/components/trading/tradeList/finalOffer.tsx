// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import {
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
import { Currency } from "shared/configs/currencies";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

/**
 * Displays a currency icon and amount.
 *
 * @param props The props for the component.
 * @param props.position The position of the component.
 * @param props.currencyType The type of currency to display.
 * @param props.amount The amount of currency to display.
 * @returns The component.
 */
export const CurrencyDisplay = (props: { position: UDim2; currencyType: Currency; amount: number }): Roact.Element => {
	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundColor3={Color3.fromRGB(12, 134, 211)}
			Position={props.position}
			Size={UDim2.fromScale(0.42, 0.09)}
		>
			<uicorner CornerRadius={new UDim(0.2, 0)} />
			<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(9, 96, 150) }} />
			<CurrencyIcon
				anchorPoint={new Vector2(0, 0)}
				position={UDim2.fromScale(0, 0)}
				size={{ maximizedSize: 1, minimizedSize: 0.9 }}
				currency={props.currencyType}
			/>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.55, 0.5)}
				Size={UDim2.fromScale(0.8, 0.8)}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextXAlignment={Enum.TextXAlignment.Left}
				Text={twoDpAbbreviator.numberToString(props.amount)}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(12, 134, 211) }} />
			</textlabel>
		</frame>
	);
};

/**
 * Displays an offer.
 *
 * @param props The props for the component.
 * @param props.position The position of the component.
 * @returns The component.
 */
export const OfferDisplay = (props: { position: UDim2 }): Roact.Element => {
	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={props.position}
			Size={UDim2.fromScale(0.46, 0.57)}
		>
			<uicorner CornerRadius={new UDim(0.125, 0)} />
			<BaseUIStroke native={{ Thickness: 4, Color: Color3.fromRGB(12, 134, 211) }} />
			<scrollingframe
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.52)}
				Size={UDim2.fromScale(0.98, 0.98)}
				ScrollingDirection={Enum.ScrollingDirection.Y}
				ScrollBarImageColor3={Color3.fromRGB(8, 82, 129)}
			></scrollingframe>
		</frame>
	);
};

/**
 * Displays the final offer.
 *
 * @returns The component.
 */
export const FinalOffer = (): Roact.Element => {
	return (
		<BaseFrame Size={UDim2.fromScale(1, 1)}>
			<ImageButton
				native={{
					Position: UDim2.fromScale(0.615, 0.89),
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
					stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
				/>
			</ImageButton>

			<ImageButton
				native={{
					Position: UDim2.fromScale(0.384, 0.89),
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
					stroke={{ native: { Thickness: 2, Color: uiOffButtonStrokeColor } }}
				/>
			</ImageButton>

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.085, 0),
					Size: UDim2.fromScale(0.35, 1),
					Text: "Your Offer",
				}}
				stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
			/>

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.585, 0),
					Size: UDim2.fromScale(0.35, 1),
					Text: "Their Offer",
				}}
				stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
			/>

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.785),
					Size: UDim2.fromScale(0.96, 0.048),
					Text: "Once you click Confirm, the trade is final! You cannot undo a trade. Careful!",
				}}
				stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
			/>
		</BaseFrame>
	);
};
