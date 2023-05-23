import { remotes } from "shared/remotes";

const namespace = remotes.Client.GetNamespace("accolades");

/**
 * Remotes for accolades.
 */
export const accoladeRemotes = {
	claimAccolade: namespace.Get("claimAccolade"),
};
