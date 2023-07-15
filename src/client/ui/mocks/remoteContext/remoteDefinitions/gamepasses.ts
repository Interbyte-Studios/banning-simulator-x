import { UseGamepassGiftDefinition } from "shared/remotes/gamepasses";

import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 *  This is the remote context for gamepass remote events.
 */
export const gamepassEremoteContext = {
	useGamepassGift: fakeRemoteCall<UseGamepassGiftDefinition>("useGamepassGift"),
};
