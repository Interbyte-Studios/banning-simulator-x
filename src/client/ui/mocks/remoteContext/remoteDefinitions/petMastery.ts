import { ClaimPetMasteryDefinition } from "shared/remotes/petMastery/claimMastery";
import { TogglePetMasteryCosmetic } from "shared/remotes/petMastery/toggleCosmetic";

import { fakeFunctionCall } from "../fakeFunctionCall";
import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 * This is the remote context for the pet mastery remote functions.
 */
export const petMasteryRemoteContext = {
	claimPetMastery: fakeFunctionCall<ClaimPetMasteryDefinition>("claimPetMastery", () => {
		return {
			success: true,
		};
	}),
	togglePetMasteryCosmetic: fakeRemoteCall<TogglePetMasteryCosmetic>("togglePetMasteryCosmetic"),
};
