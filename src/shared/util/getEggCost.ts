import { Currency } from "shared/configs/currencies";
import { EggName } from "shared/configs/eggs";

import { getEggData } from "./getEggData";
import { getZoneData } from "./getZoneData";

export interface EggCost {
	amount: number;
	currencyType: Currency;
}

/**
 * @param egg The name of the egg.
 * @param isVoid Whether or not the egg is a void egg or not.
 * @returns The cost of the egg.
 */
export function getEggCost(egg: EggName, isVoid: boolean): EggCost {
	const eggData = getEggData(egg);
	const zoneData = getZoneData(eggData.world, { zone: eggData.zone });

	const eggCost: EggCost = {
		amount: 0,
		currencyType: "gold",
	};

	if (zoneData.data.cost === undefined) {
		// eggs in the first zone of each world (first zones are always free)
		switch (egg) {
			case "Starter": {
				const cost = 500;

				eggCost.amount = isVoid ? cost * 5 : cost;
				eggCost.currencyType = "gold";
				break;
			}
			default: {
				throw `Unexpected issue while finding cost for "${egg}"`;
			}
		}
	} else {
		eggCost.amount = isVoid ? zoneData.data.cost.amount * 1.5 * 5 : zoneData.data.cost.amount;
		eggCost.currencyType = zoneData.data.cost.currency;
	}

	return eggCost;
}
