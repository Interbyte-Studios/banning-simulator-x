import { UseBoostDefinition } from "shared/remotes/boosts";

import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 *  This is the remote context for the boosts remote functions.
 */
export const boostsRemoteContext = {
	useBoost: fakeRemoteCall<UseBoostDefinition>("useBoost"),
};
