import Rodux from "@rbxts/rodux";
import { Currency } from "shared/configs/currencies";

export type WeaponsState = Set<number>;
export type WeaponsActions = PurchaseWeapon;

export interface PurchaseWeapon extends Rodux.Action<"purchaseWeapon"> {
	cost: {
		currency: Currency;
		amount: number;
	};
	id: number;
}

/**
 * Purchases a weapon from the store, saving it to the players weapon inventory.
 *
 * @param data The data associated with the weapon purchase.
 * @returns The Rodux action to dispatch.
 */
export function purchaseWeapon(data: Omit<PurchaseWeapon, "type">): PurchaseWeapon {
	return {
		type: "purchaseWeapon",
		id: data.id,
		cost: data.cost,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const weaponsReducer = Rodux.createReducer<WeaponsState, WeaponsActions>(new Set(), {
	purchaseWeapon: (state, action) => {
		return new Set([...state, action.id]);
	},
});
/* eslint-enable jsdoc/require-jsdoc */
