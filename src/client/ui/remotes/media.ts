import { remotes } from "shared/remotes";

const remoteNamespace = remotes.Client.GetNamespace("media");

/**
 * Remotes for media.
 */
export const mediaRemotes = {
	redeemCode: remoteNamespace.Get("redeemCode"),
	verifyDiscord: remoteNamespace.Get("verifyDiscord"),
};
