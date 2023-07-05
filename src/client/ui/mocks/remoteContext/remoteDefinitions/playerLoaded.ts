import { HasClickedPlayDefinition } from "shared/remotes/playerLoaded/hasClickedPlay";
import { RoactMountedDefinition } from "shared/remotes/playerLoaded/roactMounted";

import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 * This is the remote context for the player loaded remote functions.
 */
export const playerLoadedContext = {
	roactMounted: fakeRemoteCall<RoactMountedDefinition>("roactMounted"),
	hasClickedPlay: fakeRemoteCall<HasClickedPlayDefinition>("hasClickedPlay"),
};
