import Rodux from "@rbxts/rodux";

export type CurrentAuraState = number;
export type CurrentAuraActions = EquipAura;

interface EquipAura extends Rodux.Action<"equipAura"> {
	id: number;
}

/**
 *
 * @param id The aura id that is being equipped.
 * @returns The Rodux action to dispatch.
 */
export function equipAura(id: number): EquipAura & Rodux.AnyAction {
	return {
		type: "equipAura",
		id,
	};
}

const defaultAuraId = -1;

/* eslint-disable jsdoc/require-jsdoc */
export const currentAuraReducer = Rodux.createReducer<CurrentAuraState, CurrentAuraActions>(defaultAuraId, {
	equipAura: (state, action) => {
		return action.id;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
