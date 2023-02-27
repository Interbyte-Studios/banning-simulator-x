import Rodux from "@rbxts/rodux";

export type ClaimedAccolade = number;
export type AccoladeState = Array<ClaimedAccolade>;
export type AccoladeActions = ClaimAccolade;

interface ClaimAccolade extends Rodux.Action<"claimAccolade"> {
	id: number;
}

/**
 * @param id The id of the accolade to claim.
 * @returns The Rodux action to dispatch.
 */
export function claimAccolade(id: number): ClaimAccolade & Rodux.AnyAction {
	return {
		type: "claimAccolade",
		id,
	};
}

const defaultAccoladeState: AccoladeState = [];

/* eslint-disable jsdoc/require-jsdoc */
export const accoladeReducer = Rodux.createReducer<AccoladeState, AccoladeActions>(defaultAccoladeState, {
	claimAccolade: (state, action) => {
		const newState = [...state];
		newState.push(action.id);

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
