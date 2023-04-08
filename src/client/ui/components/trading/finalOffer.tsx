import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { Currency } from "shared/configs/currencies";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

export const CurrencyDisplay = hooks((props: { position: UDim2; currencyType: Currency; amount: number }) => {
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
});

export const OfferDisplay = hooks((props: { position: UDim2 }) => {
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
});

export const FinalOffer = hooks(() => {
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
				Position={UDim2.fromScale(0.615, 0.89)}
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
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Text={"Confirm"}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(21, 167, 61) }} />
				</textlabel>
			</imagebutton>
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.384, 0.89)}
				Size={UDim2.fromScale(0.2, 0.2)}
				Image={assetIds.images.ui.index.Off}
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
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Text={"Cancel"}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(147, 21, 101) }} />
				</textlabel>
			</imagebutton>
			<textlabel
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.085, 0)}
				Size={UDim2.fromScale(0.35, 1)}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={"Your Offer"}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(12, 134, 211) }} />
			</textlabel>
			<textlabel
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.585, 0)}
				Size={UDim2.fromScale(0.35, 1)}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={"Their Offer"}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(12, 134, 211) }} />
			</textlabel>
			<textlabel
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.785)}
				Size={UDim2.fromScale(0.96, 0.048)}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={"Once you click Confirm, the trade is final! You cannot undo a trade. Careful!"}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(12, 134, 211) }} />
			</textlabel>
		</frame>
	);
});
