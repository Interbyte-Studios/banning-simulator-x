import Rodux from "@rbxts/rodux";
import { Currency } from "shared/configs/currencies";

export type TalismansState = Map<number, { bans: number }>;

export type TalismanActions = PurchaseTalisman;

export interface PurchaseTalisman extends Rodux.Action<"purchaseTalisman"> {
	cost: {
		currency: Currency;
		amount: number;
	};
	id: number;
}

/**
 * Purchases a talisman from the stor, saving it to players talisman inventory.
 *
 * @param data The data associated with the talisman purchase.
 * @returns The Rodux action to dispatch.
 */
export function purchaseTalisman(data: Omit<PurchaseTalisman, "type">): PurchaseTalisman & Rodux.AnyAction {
	return {
		type: "purchaseTalisman",
		id: data.id,
		cost: data.cost,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const talismanReducer = Rodux.createReducer<TalismansState, TalismanActions>(new Map(), {
	purchaseTalisman: (state, action) => {
		return new Map([...state, [action.id, { bans: 0 }]]);
	},
});
/* eslint-enable jsdoc/require-jsdoc */
