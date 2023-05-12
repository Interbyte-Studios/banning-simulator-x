import { t } from "@rbxts/t";

import { isCurrency } from "./currencies";

export const isPlayerTradeItem = t.strictInterface({
	pets: t.array(t.string),
	currency: t.optional(
		t.strictInterface({
			type: isCurrency,
			amount: t.numberPositive,
		}),
	),
});
export type PlayerTradeItem = t.static<typeof isPlayerTradeItem>;
