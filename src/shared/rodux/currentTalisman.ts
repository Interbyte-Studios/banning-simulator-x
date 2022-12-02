import Rodux from "@rbxts/rodux";

import { PurchaseTalisman } from "./talismans";

export type CurrentTalismanState = number | undefined;
export type CurrentTalismanActions = EquipTalisman;

interface EquipTalisman extends Rodux.Action<"equipTalisman"> {
	id: number;
}

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

const defaultTalismanId = undefined;

/*eslint-disable jsdoc/require-jsdoc */
export const currentTalismanReducer = Rodux.createReducer<
	CurrentTalismanState,
	CurrentTalismanActions | PurchaseTalisman
>(defaultTalismanId, {
	equipTalisman: (state, action) => {
		return action.id;
	},
	purchaseTalisman: (state, action) => {
		return action.id;
	},
});
/*eslint-enable jsdoc/require-jsdoc */
