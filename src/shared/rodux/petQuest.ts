import Rodux from "@rbxts/rodux";

export type PetQuestState = Array<number>;
export type PetQuestActions = ClaimPetFromQuest;

interface ClaimPetFromQuest extends Rodux.Action<"claimPetFromQuest"> {
	id: number;
}

/**
 * @param id The id of the pet to claim.
 * @returns The Rodux action to dispatch.
 */
export function claimPetFromQuest(id: number): ClaimPetFromQuest & Rodux.AnyAction {
	return {
		type: "claimPetFromQuest",
		id,
	};
}

export const defaultPetQuestState: PetQuestState = [];

/* eslint-disable jsdoc/require-jsdoc */
export const petQuestReducer = Rodux.createReducer<PetQuestState, PetQuestActions>(defaultPetQuestState, {
	claimPetFromQuest: (state, action) => {
		return [...state, action.id];
	},
});
/* eslint-enable jsdoc/require-jsdoc */
