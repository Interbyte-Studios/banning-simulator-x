import Rodux from "@rbxts/rodux";

import { PurchaseTalisman } from "./talismans";

export type CurrentTalismanState = number | undefined;
export type CurrentTalismanActions = EquipTalisman | UnequipTalisman;

interface EquipTalisman extends Rodux.Action<"equipTalisman"> {
	id: number;
}

interface UnequipTalisman extends Rodux.Action<"unequipTalisman"> {}

/**
 *
 * @param id The talisman id that is being equipped.
 * @returns The Rodux action to dispatch.
 */
export function equipTalisman(id: number): EquipTalisman & Rodux.AnyAction {
	return {
		type: "equipTalisman",
		id,
	};
}

/**
 *
 * @returns The Rodux action to dispatch.
 */
export function unequipTalisman(): UnequipTalisman & Rodux.AnyAction {
	return {
		type: "unequipTalisman",
	};
}

const defaultTalismanId = undefined;

/*eslint-disable jsdoc/require-jsdoc */
export const currentTalismanReducer = Rodux.createReducer<
	CurrentTalismanState,
	CurrentTalismanActions | PurchaseTalisman
>(defaultTalismanId, {
	equipTalisman: (state, action) => {
		return action.id;
	},
	unequipTalisman: () => {
		return undefined;
	},
	purchaseTalisman: (state, action) => {
		return action.id;
	},
});
/*eslint-enable jsdoc/require-jsdoc */
