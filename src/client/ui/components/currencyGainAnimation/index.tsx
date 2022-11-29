import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { Currency } from "shared/configs/currencies";
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

cachedCurrency.push({ name: "coins", amount: 0 });
cachedCurrency.push({ name: "gems", amount: 0 });

export const CurrencyGainAnimation = RoactRodux.connect(mapStateToProps)(
	hooks((props: CurrencyGainAnimationProps) => {
		cachedCurrency.forEach((currencyData, currencyIndex) => {
			const currentCurrencyAmount = props.currencies[currencyData.name];
			if (currencyData.amount !== currentCurrencyAmount) {
				cachedCurrency[currencyIndex].amount = currentCurrencyAmount;

				for (let i = 0; i < 4; i++) {
					const elementId = cachedCurrencyImages.size() + 1;

					const element = {
						id: elementId,
						component: (
							<Slot
								animatedTo={UDim2.fromScale(0.1, 0.5)}
								icon={assetIds.images.currencies[currencyData.name]}
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
			}
		});

		const unpackedCurrencyIcons: Array<Roact.Element> = [];
		cachedCurrencyImages.forEach((slot) => {
			unpackedCurrencyIcons.push(slot.component);
		});

		return (
			<frame
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.5)}
			>
				{unpackedCurrencyIcons}
			</frame>
		);
	}),
);
