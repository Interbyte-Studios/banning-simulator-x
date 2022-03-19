import Rodux from "@rbxts/rodux";
import { Currency } from "shared/configs/currencies";

export type WeaponsState = Map<
	number,
	{
		bans: number;
	}
>;
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
export function purchaseWeapon(data: Omit<PurchaseWeapon, "type">): PurchaseWeapon & Rodux.AnyAction {
	return {
		type: "purchaseWeapon",
		id: data.id,
		cost: data.cost,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const weaponsReducer = Rodux.createReducer<WeaponsState, WeaponsActions>(new Map(), {
	purchaseWeapon: (state, action) => {
		return new Map([...state, [action.id, { bans: 0 }]]);
	},
});
/* eslint-enable jsdoc/require-jsdoc */
