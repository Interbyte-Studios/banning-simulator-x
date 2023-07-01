import Rodux from "@rbxts/rodux";

export type GroupRankState = number;

export type GroupRankActions = SetGroupRank;

interface SetGroupRank extends Rodux.Action<"setGroupRank"> {
	rank: number;
}

/**
 * @param rank The rank to set.
 * @returns The Rodux action to dispatch.
 */
export function setGroupRank(rank: number): SetGroupRank & Rodux.AnyAction {
	return {
		type: "setGroupRank",
		rank,
	};
}

export const defaultGroupRankState: GroupRankState = 0;
/* eslint-disable jsdoc/require-jsdoc */
export const groupRankReducer = Rodux.createReducer<GroupRankState, GroupRankActions>(defaultGroupRankState, {
	setGroupRank: (_, action) => action.rank,
});
/* eslint-enable jsdoc/require-jsdoc */
