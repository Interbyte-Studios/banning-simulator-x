import { remotes } from "shared/remotes";

/**
 * Remotes for wheel spin.
 */
export const wheelSpinRemotes = {
	spinWheel: remotes.Client.Get("spinWheel"),
	spinWheelInfo: remotes.Client.Get("spinWheelInfo"),
};
