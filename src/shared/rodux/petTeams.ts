import Rodux from "@rbxts/rodux";

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

export const defaultPetTeamsState: PetTeamsState = {
	maxTeams: 1,
	teams: [],
};

/* eslint-disable jsdoc/require-jsdoc */
export const petTeamsReducer = Rodux.createReducer<PetTeamsState, PetTeamsActions | DeletePet>(defaultPetTeamsState, {
	createPetTeam: (state, action) => {
		if (state.teams.size() >= state.maxTeams) {
			return state;
		}

		return {
			maxTeams: state.maxTeams,
			teams: [
				...state.teams,
				{
					id: state.teams.size() + 1,
					name: "",
					pets: action.petsToAddToTeam,
				},
			],
		};
	},
	purchasePetTeam: (state) => {
		return {
			maxTeams: state.maxTeams + 1,
			teams: state.teams,
		};
	},
	deletePetTeam: (state, action) => {
		return {
			...state,
			teams: state.teams.filter((team) => team.id !== action.teamId),
		};
	},
	updateTeamName: (state, action) => {
		const newState: PetTeamsState = {
			...state,
			teams: state.teams.map((team) => {
				if (team.id !== action.teamId) {
					return team;
				}

				return {
					...team,
					name: action.name,
				};
			}),
		};

		return newState;
	},
	deletePet: (state, action) => {
		const newState: PetTeamsState = {
			...state,
			teams: state.teams.map((team) => ({
				...team,
				pets: team.pets.filter((petGuid) => !action.pets.includes(petGuid)),
			})),
		};

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
