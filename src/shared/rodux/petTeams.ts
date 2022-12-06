import Rodux, { makeActionCreator } from "@rbxts/rodux";

import { DeletePet } from "./pets";

export type PetTeamsState = {
	maxTeams: number;
	teams: Array<{
		id: number;
		name: string;
		pets: Array<string>;
	}>;
};
export type PetTeamsActions = CreatePetTeam | PurchasePetTeam | DeletePetTeam | UpdateTeamName;

interface CreatePetTeam extends Rodux.Action<"createPetTeam"> {
	petsToAddToTeam: Array<string>;
}

interface PurchasePetTeam extends Rodux.Action<"purchasePetTeam"> {}
interface DeletePetTeam extends Rodux.Action<"deletePetTeam"> {
	teamId: number;
}

interface UpdateTeamName extends Rodux.Action<"updateTeamName"> {
	teamId: number;
	name: string;
}

/**
 * Creates a pet team.
 *
 * @param pets The pets to add to the team.
 * @returns The rodux action to dispatch.
 */
export function createPetTeam(pets: Array<string>): CreatePetTeam & Rodux.AnyAction {
	return {
		type: "createPetTeam",
		petsToAddToTeam: pets,
	};
}

/**
 * Allows the player to use an extra pet team.
 *
 * @returns The rodux action to dispatch.
 */
export function purchasePetTeam(): PurchasePetTeam & Rodux.AnyAction {
	return {
		type: "purchasePetTeam",
	};
}

/**
 * Deletes the specified pet team.
 *
 * @param teamId The id of the team.
 * @returns The rodux action to dispatch.
 */
export function deletePetTeam(teamId: number): DeletePetTeam & Rodux.AnyAction {
	return {
		type: "deletePetTeam",
		teamId,
	};
}

/**
 * Updates the stored name of the specified team.
 *
 * @param teamId The id of the team.
 * @param name The name of the team.
 * @returns The rodux action to dispatch.
 */
export function updateTeamName(teamId: number, name: string): UpdateTeamName & Rodux.AnyAction {
	return {
		type: "updateTeamName",
		teamId,
		name,
	};
}

const petTeams: PetTeamsState = {
	maxTeams: 1,
	teams: [],
};

/* eslint-disable jsdoc/require-jsdoc */
export const petTeamsReducer = Rodux.createReducer<PetTeamsState, PetTeamsActions | DeletePet>(petTeams, {
	createPetTeam: (state, action) => {
		if (state.teams.size() >= state.maxTeams) {
			return state;
		}

		const newState = {
			maxTeams: state.maxTeams,
			teams: state.teams,
		};

		const newTeam = {
			id: state.teams.size() + 1,
			name: "",
			pets: action.petsToAddToTeam,
		};

		newState.teams.push(newTeam);
		return newState;
	},
	purchasePetTeam: (state) => {
		return {
			maxTeams: state.maxTeams + 1,
			teams: state.teams,
		};
	},
	deletePetTeam: (state, action) => {
		const newState: PetTeamsState = { ...state };

		const newTeamData = [...newState.teams];
		const filteredTeams = newTeamData.filter((team) => team.id !== action.teamId);

		newState.teams = filteredTeams;

		return newState;
	},
	updateTeamName: (state, action) => {
		const newState: PetTeamsState = { ...state };

		const storedTeam = newState.teams.find((team) => team.id === action.teamId);
		assert(storedTeam, `Failed to get stored team for team with id ${action.teamId}`);

		storedTeam.name = action.name;

		return newState;
	},
	deletePet: (state, action) => {
		const newState: PetTeamsState = { ...state };

		for (const team of newState.teams) {
			for (const [index, petGuid] of pairs(team.pets)) {
				const isBeingDeleted = action.pets.find((deletedPetGuid) => deletedPetGuid === petGuid);
				if (isBeingDeleted === undefined) {
					continue;
				}

				team.pets.unorderedRemove(index);
			}
		}

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
