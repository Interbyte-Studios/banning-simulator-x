import Rodux from "@rbxts/rodux";

export type CurrentTalismanState = number;
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
		id: id,
	};
}

const defaultTalismanId = 1;

/*eslint-disable jsdoc/require-jsdoc */
export const currentTalismanReducer = Rodux.createReducer<CurrentTalismanState, CurrentTalismanActions>(
	defaultTalismanId,
	{
		equipTalisman: (state, action) => {
			return action.id;
		},
	},
);
/*eslint-enable jsdoc/require-jsdoc */
