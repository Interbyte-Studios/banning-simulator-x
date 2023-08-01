import assetIds from "shared/assets";
import { Currency } from "shared/configs/currencies";

/**
 * @param currency The type of currency.
 * @returns The asset id of the icon associated with the given currency.
 */
export function getCurrencyIcon(currency: Currency): string {
	debug.setmemorycategory("getCurrencyIcon");
	switch (currency) {
		case "coins": {
			return assetIds.images.vectors.Coin;
		}
		case "gems": {
			return assetIds.images.vectors.Gem;
		}
		case "gears": {
			return assetIds.images.vectors.Gear;
		}
	}
}
