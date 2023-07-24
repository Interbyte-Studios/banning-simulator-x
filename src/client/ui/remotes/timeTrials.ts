import { remotes } from "shared/remotes";

/**
 * Remotes for time trials.
 */
export const timeTrialsRemotes = {
	upgradeTimeTrial: remotes.Client.GetNamespace("timeTrials").Get("upgradeTimeTrials"),
	createTimeTrial: remotes.Client.GetNamespace("timeTrials").Get("createTimeTrial"),
	startTimeTrial: remotes.Client.GetNamespace("timeTrials").Get("startTimeTrial"),
	stopTimeTrial: remotes.Client.GetNamespace("timeTrials").Get("stopTimeTrial"),
};
