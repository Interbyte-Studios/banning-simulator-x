import { ClaimPetQuestDefinition } from "shared/remotes/claimPetQuest";

import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 *  This is the remote context for the pet quest remote functions.
 */
export const petQuestRemoteContext = {
	claimPetFromQuest: fakeRemoteCall<ClaimPetQuestDefinition>("claimPetFromQuest"),
};
