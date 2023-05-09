import { remotes } from "shared/remotes";

const remoteNamespace = remotes.Client.GetNamespace("eggs");

/**
 * Remotes for eggs.
 */
export const eggsRemotes = {
	hatchEgg: remoteNamespace.Get("hatchEgg"),
};
