import { remotes } from "shared/remotes";

/**
 * Remotes for pet quests.
 */
export const petQuestRemotes = {
	claimPetFromQuest: remotes.Client.Get("claimPetQuest"),
};
