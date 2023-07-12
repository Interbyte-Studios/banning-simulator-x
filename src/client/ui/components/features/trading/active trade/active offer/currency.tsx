import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players } from "@rbxts/services";
import { font, uiTextStrokeColor, vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { hooks } from "client/ui/hooks";
import { PlayerTradeItem } from "shared/configs/trading";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";

import { canClickInActiveTrade } from "../canClick";

interface ActiveCurrencyOfferProps extends MappedActiveCurrencyOfferProps {
	player: Player;
	currentOffer: PlayerTradeItem;
	setOffer: (offer: PlayerTradeItem) => void;
	resetTrade: () => void;
}

interface MappedActiveCurrencyOfferProps {
	currencies: CurrenciesState;
}

enum TradedCurrency {
	Coins = "coins",
	Gems = "gems",
}

/**
 *
 * @param state The current store state.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): MappedActiveCurrencyOfferProps {
	return {
		currencies: state.currencies,
	};
}

/**
 * Displays the offer for the currency being traded.
 *
 * @returns The Roact element to render.
 */
export const ActiveCurrencyOffer = RoactRodux.connect(mapStateToProps)(
	hooks((props: ActiveCurrencyOfferProps, hooks) => {
		const { useState, useEffect } = hooks;

		// state to cache when the currency is updated
		const [updateTime, setUpdateTime] = useState(0);

		// state to log the currency metadata
		const [offeredCurrencyType, setOfferedCurrencyType] = useState<TradedCurrency>(
			props.currentOffer.currency === undefined || props.currentOffer.currency.type === "coins"
				? TradedCurrency.Coins
				: TradedCurrency.Gems,
		);
		const [offeredCurrency, setOfferedCurrency] = useState(props.currentOffer.currency?.amount ?? 0);

		// update state when the currency is updated
		useEffect(() => {
			if (offeredCurrency > props.currencies[offeredCurrencyType]) {
				setOfferedCurrency(props.currencies[offeredCurrencyType]);
			}
		}, [offeredCurrency]);

		// update state when the currency prop is updated
		useEffect(() => {
			if (props.currentOffer.currency !== undefined) {
				setOfferedCurrencyType(
					props.currentOffer.currency.type === "coins" ? TradedCurrency.Coins : TradedCurrency.Gems,
				);
			}
		}, [props.currentOffer.currency]);

		// update higher ordered components
		useEffect(() => {
			if (props.player.UserId !== Players.LocalPlayer.UserId) {
				return;
			}

			if (
				props.currentOffer.currency !== undefined &&
				props.currentOffer.currency.type === offeredCurrencyType &&
				props.currentOffer.currency.amount === offeredCurrency
			) {
				return;
			}
			props.setOffer({
				...props.currentOffer,
				currency: {
					type: offeredCurrencyType,
					amount: offeredCurrency,
				},
			});
		}, [updateTime, offeredCurrencyType]);

		const isLocalPlayer = props.player.UserId === Players.LocalPlayer.UserId;
		const isMax = offeredCurrency >= props.currencies[offeredCurrencyType];

		/**
		 * Determines the rendered element based on whether the player is local or foreign.
		 *
		 * @returns The rendered element.
		 */
		function renderedElement(): Roact.Element {
			if (isLocalPlayer) {
				return (
					<textbox
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.55, 0.5)}
						Size={UDim2.fromScale(0.8, 0.8)}
						Font={font}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Text={""}
						TextScaled={true}
						PlaceholderColor3={Color3.fromRGB(255, 255, 255)}
						PlaceholderText={
							offeredCurrency !== 0
								? isMax
									? `${statsAbbreviator.numberToString(offeredCurrency)} (Max)`
									: `${statsAbbreviator.numberToString(offeredCurrency)}`
								: "Enter amount: (Ex: 500k)"
						}
						TextXAlignment={Enum.TextXAlignment.Left}
						Change={{
							/**
							 * Called when the textbox is changed.
							 *
							 * @param textBox The textbox that was changed.
							 */
							Text: (textBox): void => {
								const textAmount = textBox.Text;
								if (textAmount === "") {
									return;
								}

								const amount = tonumber(textAmount);
								if (amount === undefined) {
									return;
								}

								if (amount < 0) {
									return;
								}

								if (amount > props.currencies[offeredCurrencyType]) {
									setOfferedCurrency(props.currencies[offeredCurrencyType]);
									return;
								}

								setOfferedCurrency(amount);
							},
						}}
						Event={{
							/**
							 * Called when the textbox is no longer focused.
							 *
							 * @param textBox The textbox that was changed.
							 */
							FocusLost: (textBox): void => {
								textBox.Text = isMax
									? `${statsAbbreviator.numberToString(offeredCurrency)} (Max)`
									: `${statsAbbreviator.numberToString(offeredCurrency)}`;

								if (offeredCurrency < 0) {
									return;
								}

								setUpdateTime(time());
							},
						}}
					>
						<BaseUIStroke native={{ Thickness: 2, Color: uiTextStrokeColor }} />
					</textbox>
				);
			} else {
				return (
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.55, 0.5),
							Size: UDim2.fromScale(0.8, 0.8),
							Text:
								props.currentOffer.currency !== undefined
									? statsAbbreviator.numberToString(props.currentOffer.currency.amount)
									: "",
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{ native: { Color: uiTextStrokeColor, Thickness: 2 } }}
					/>
				);
			}
		}

		return (
			<BaseFrame
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(12, 134, 211)}
				Position={isLocalPlayer ? UDim2.fromScale(0.5, 1.08) : UDim2.fromScale(0.5, 0.915)}
				Size={isLocalPlayer ? UDim2.fromScale(1, 0.115) : UDim2.fromScale(0.9, 0.1)}
			>
				<uicorner CornerRadius={new UDim(0.2, 0)} />
				<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(9, 96, 150) }} />

				{renderedElement()}

				<CurrencyIcon
					anchorPoint={vec2Middle}
					position={UDim2.fromScale(0.065, 0.5)}
					size={{ minimizedSize: 0.9, maximizedSize: 1 }}
					currency={
						props.currentOffer.currency === undefined || props.currentOffer.currency.type === "coins" ? "coins" : "gems"
					}
					events={{
						/**
						 * Called when the currency icon is activated.
						 */
						Activated: (): void => {
							if (!isLocalPlayer) {
								return;
							}

							if (!canClickInActiveTrade()) {
								return;
							}

							switch (offeredCurrencyType) {
								case TradedCurrency.Coins: {
									setOfferedCurrencyType(TradedCurrency.Gems);
									return;
								}
								case TradedCurrency.Gems: {
									setOfferedCurrencyType(TradedCurrency.Coins);
									return;
								}
							}
						},
					}}
				/>
			</BaseFrame>
		);
	}),
);
