import { remotes } from "shared/remotes";

const namespace = remotes.Client.GetNamespace("playerLoaded");

/**
 * Remotes for player loaded.
 */
export const playerLoadedRemtoes = {
	roactMounted: namespace.Get("roactMounted"),
	hasClickedPlay: namespace.Get("hasClickedPlay"),
};
