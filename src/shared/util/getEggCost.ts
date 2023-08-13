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

	switch (eggData.id) {
		case 1: {
			const cost = 40;
			const voidCost = cost * 25;
			eggCost.amount = isVoid ? voidCost - voidCost * reducedCost : cost - cost * reducedCost;
			eggCost.amount = math.ceil(eggCost.amount);
			eggCost.currencyType = "coins";
			break;
		}
		case 2: {
			if (zoneData.cost === undefined) {
				throw `Unexpected issue while finding cost for "${egg}"`;
			}

			const cost = 125;
			const voidCost = cost * 25;
			eggCost.amount = isVoid ? voidCost - voidCost * reducedCost : cost - cost * reducedCost;
			eggCost.amount = math.ceil(eggCost.amount);
			eggCost.currencyType = zoneData.cost.currency;
			break;
		}
		case 3: {
			if (zoneData.cost === undefined) {
				throw `Unexpected issue while finding cost for "${egg}"`;
			}

			const cost = 500;
			const voidCost = cost * 25;
			eggCost.amount = isVoid ? voidCost - voidCost * reducedCost : cost - cost * reducedCost;
			eggCost.amount = math.ceil(eggCost.amount);
			eggCost.currencyType = zoneData.cost.currency;
			break;
		}
		case 4: {
			if (zoneData.cost === undefined) {
				throw `Unexpected issue while finding cost for "${egg}"`;
			}

			const cost = 1_250;
			const voidCost = cost * 25;
			eggCost.amount = isVoid ? voidCost - voidCost * reducedCost : cost - cost * reducedCost;
			eggCost.amount = math.ceil(eggCost.amount);
			eggCost.currencyType = zoneData.cost.currency;
			break;
		}
		case 5: {
			if (zoneData.cost === undefined) {
				throw `Unexpected issue while finding cost for "${egg}"`;
			}

			const cost = 1_500;
			const voidCost = cost * 25;
			eggCost.amount = isVoid ? voidCost - voidCost * reducedCost : cost - cost * reducedCost;
			eggCost.amount = math.ceil(eggCost.amount);
			eggCost.currencyType = zoneData.cost.currency;
			break;
		}
		case 7: {
			const cost = 5;
			const voidCost = cost * 25;
			eggCost.amount = isVoid ? voidCost - voidCost * reducedCost : cost - cost * reducedCost;
			eggCost.amount = math.ceil(eggCost.amount);
			eggCost.currencyType = "cyber tokens";
			break;
		}
		case 8: {
			if (zoneData.cost === undefined) {
				throw `Unexpected issue while finding cost for "${egg}"`;
			}

			const cost = 405;
			const voidCost = cost * 25;
			eggCost.amount = isVoid ? voidCost - voidCost * reducedCost : cost - cost * reducedCost;
			eggCost.amount = math.ceil(eggCost.amount);
			eggCost.currencyType = zoneData.cost.currency;
			break;
		}
		case 9: {
			if (zoneData.cost === undefined) {
				throw `Unexpected issue while finding cost for "${egg}"`;
			}

			const cost = 5_300;
			const voidCost = cost * 25;
			eggCost.amount = isVoid ? voidCost - voidCost * reducedCost : cost - cost * reducedCost;
			eggCost.amount = math.ceil(eggCost.amount);
			eggCost.currencyType = zoneData.cost.currency;
			break;
		}
		case 10: {
			if (zoneData.cost === undefined) {
				throw `Unexpected issue while finding cost for "${egg}"`;
			}

			const cost = 15_000;
			const voidCost = cost * 25;
			eggCost.amount = isVoid ? voidCost - voidCost * reducedCost : cost - cost * reducedCost;
			eggCost.amount = math.ceil(eggCost.amount);
			eggCost.currencyType = zoneData.cost.currency;
			break;
		}
		case 12: {
			if (zoneData.cost === undefined) {
				throw `Unexpected issue while finding cost for "${egg}"`;
			}

			const cost = 12_000;
			const voidCost = cost * 25;
			eggCost.amount = isVoid ? voidCost - voidCost * reducedCost : cost - cost * reducedCost;
			eggCost.amount = math.ceil(eggCost.amount);
			eggCost.currencyType = zoneData.cost.currency;
			break;
		}
		case 14: {
			const cost = 5_000;
			const voidCost = cost * 25;
			eggCost.amount = isVoid ? voidCost - voidCost * reducedCost : cost - cost * reducedCost;
			eggCost.amount = math.ceil(eggCost.amount);
			eggCost.currencyType = "coins";
			break;
		}
		case 15: {
			const cost = 25;
			const voidCost = cost * 25;
			eggCost.amount = isVoid ? voidCost - voidCost * reducedCost : cost - cost * reducedCost;
			eggCost.amount = math.ceil(eggCost.amount);
			eggCost.currencyType = "gears";
			break;
		}
		case 17: {
			const cost = 10_000;
			eggCost.amount = cost - cost * reducedCost;
			eggCost.amount = math.ceil(eggCost.amount);
			eggCost.currencyType = "coins";
			break;
		}
		default: {
			if (zoneData.cost === undefined) {
				throw `Unexpected issue while finding cost for "${egg}"`;
			}

			const cost = zoneData.cost.amount / 20;
			const voidCost = cost * 25;
			eggCost.amount = isVoid ? voidCost - voidCost * reducedCost : cost - cost * reducedCost;
			eggCost.amount = math.ceil(eggCost.amount);
			eggCost.currencyType = zoneData.cost.currency;
			break;
		}
	}

	return eggCost;
}
