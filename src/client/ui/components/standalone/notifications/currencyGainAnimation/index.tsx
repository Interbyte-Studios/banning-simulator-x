import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { hooks } from "client/ui/hooks";
import { currencies, Currency } from "shared/configs/currencies";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";

import { Slot } from "./slot";

interface CurrencyGainAnimationProps {
	currencies: CurrenciesState;
}

/**
 *
 * @param state The current state of the store.
 * @returns The props.
 */
function mapStateToProps(state: StoreState): CurrencyGainAnimationProps {
	return {
		currencies: state.currencies,
	};
}

const cachedCurrencyImages: Array<{ id: number; component: Roact.Element }> = [];
const cachedCurrency: Array<{ name: Currency; amount: number }> = [];
currencies.forEach((currency) => cachedCurrency.push({ name: currency, amount: 0 }));

export const CurrencyGainAnimation = RoactRodux.connect(mapStateToProps)(
	hooks((props: CurrencyGainAnimationProps) => {
		cachedCurrency.forEach((currencyData, currencyIndex) => {
			const currentCurrencyAmount = props.currencies[currencyData.name];
			if (currencyData.amount !== currentCurrencyAmount && currentCurrencyAmount > currencyData.amount) {
				cachedCurrency[currencyIndex].amount = currentCurrencyAmount;

				for (let i = 0; i < 4; i++) {
					const elementId = cachedCurrencyImages.size() + 1;

					const element = {
						id: elementId,
						component: (
							<Slot
								animatedTo={UDim2.fromScale(0.1, 0.5)}
								currency={currencyData.name}
								removeSlot={(): void => {
									const slot = cachedCurrencyImages.findIndex((slot) => slot.id === elementId);
									if (slot === undefined) {
										return warn(`Couldn't find slot for id ${elementId}`);
									}

									cachedCurrencyImages.unorderedRemove(slot);
								}}
							/>
						),
					};

					cachedCurrencyImages.push(element);
				}
			} else {
				cachedCurrency[currencyIndex].amount = currentCurrencyAmount;
			}
		});

		const unpackedCurrencyIcons: Array<Roact.Element> = [];
		cachedCurrencyImages.forEach((slot) => {
			unpackedCurrencyIcons.push(slot.component);
		});

		return <BaseFrame Size={UDim2.fromScale(1, 1)}>{unpackedCurrencyIcons}</BaseFrame>;
	}),
);
