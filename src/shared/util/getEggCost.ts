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
 * @param reducedCost Reduced cost provided by mastery.
 * @returns The cost of the egg.
 */
export function getEggCost(egg: EggName, isVoid: boolean, reducedCost: number): EggCost {
	const eggData = getEggData(egg);
	if (eggData.world === "Limited") {
		return {
			amount: 0,
			currencyType: "coins",
		};
	}

	if (eggData.zone === "Limited") {
		return {
			amount: 0,
			currencyType: "coins",
		};
	}

	const zoneData = getZoneData(eggData.world, eggData.zone);

	const eggCost: EggCost = {
		amount: 0,
		currencyType: "coins",
	};

	if (zoneData.cost === undefined) {
		// eggs in the first zone of each world (first zones are always free)
		switch (egg) {
			case "Starter": {
				const cost = 500;

				eggCost.amount = isVoid ? cost * 5 - cost * reducedCost : cost - cost * reducedCost;
				eggCost.currencyType = "coins";
				break;
			}
			default: {
				throw `Unexpected issue while finding cost for "${egg}"`;
			}
		}
	} else {
		eggCost.amount = isVoid
			? zoneData.cost.amount * 5 - zoneData.cost.amount * 5 * reducedCost
			: zoneData.cost.amount - zoneData.cost.amount * reducedCost;
		eggCost.currencyType = zoneData.cost.currency;
	}

	return eggCost;
}
