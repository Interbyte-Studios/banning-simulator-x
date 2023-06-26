import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { uiDarkStrokeColor, uiTextStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { Currency } from "shared/configs/currencies";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";

interface CurrencyProps {
	player: Player;
	currency: Currency;
	amount: number;
}

/**
 * This component is used to display the currency in the confirmed offer.
 *
 * @param props The properties of the currency component.
 * @param props.currency The currency to display.
 * @param props.amount The amount of the currency to display.
 * @returns A Roact element that represents the currency component.
 */
export const ConfirmedCurrencyDisplayed = (props: CurrencyProps): Roact.Element => {
	const isLocalPlayer = props.player.UserId === Players.LocalPlayer.UserId;

	return (
		<BaseFrame
			AnchorPoint={new Vector2(0, 0)}
			Position={isLocalPlayer ? UDim2.fromScale(0.04, 0.655) : UDim2.fromScale(0.549, 0.655)}
			Size={UDim2.fromScale(0.42, 0.09)}
			BackgroundTransparency={0}
			BackgroundColor3={uiTextStrokeColor}
		>
			<uicorner CornerRadius={new UDim(0.2, 0)} />
			<BaseUIStroke native={{ Thickness: 1.5, Color: uiDarkStrokeColor }} />

			<CurrencyIcon
				anchorPoint={new Vector2(0, 0)}
				position={UDim2.fromScale(0, 0)}
				size={{ minimizedSize: 0.9, maximizedSize: 1 }}
				currency={props.currency}
			/>

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.583, 0.5),
					Size: UDim2.fromScale(0.769, 0.8),
					Text: statsAbbreviator.numberToString(props.amount),
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
			/>
		</BaseFrame>
	);
};
