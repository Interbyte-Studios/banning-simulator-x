import { remotes } from "shared/remotes";

const remoteNamespace = remotes.Client.GetNamespace("petMastery");

/**
 * Remotes for pet mastery.
 */
export const petMasteryRemotes = {
	claimPetMastery: remoteNamespace.Get("claimMastery"),
	togglePetMasteryCosmetic: remoteNamespace.Get("toggleCosmetic"),
};
