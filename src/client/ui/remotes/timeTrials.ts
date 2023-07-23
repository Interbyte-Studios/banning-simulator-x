import { remotes } from "shared/remotes";

/**
 * Remotes for time trials.
 */
export const timeTrialsRemotes = {
	upgradeTimeTrial: remotes.Client.GetNamespace("timeTrials").Get("upgradeTimeTrials"),
};
