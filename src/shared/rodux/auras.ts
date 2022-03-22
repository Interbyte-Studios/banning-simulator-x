import Rodux from "@rbxts/rodux";
import { Currency } from "shared/configs/currencies";

export type AurasState = Set<number>;
export type AurasActions = PurchaseAura;

export interface PurchaseAura extends Rodux.Action<"purchaseAura"> {
	cost: {
		currency: Currency;
		amount: number;
		requiredRank: number;
	};
	id: number;
}

/**
 * Purchases an aura from the store, saving it to the players aura inventory.
 *
 * @param data The data associated with the aura purchase.
 * @returns The Rodux action to dispatch.
 */
export function purchaseAura(data: Omit<PurchaseAura, "type">): PurchaseAura {
	return {
		type: "purchaseAura",
		id: data.id,
		cost: data.cost,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const aurasReducer = Rodux.createReducer<AurasState, AurasActions>(new Set(), {
	purchaseAura: (state, action) => {
		return new Set([...state, action.id]);
	},
});
/* eslint-enable jsdoc/require-jsdoc */
