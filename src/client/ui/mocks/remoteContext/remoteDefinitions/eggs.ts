import { HatchEggDefinition } from "shared/remotes/eggs/hatchEgg";

import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 *  This is the remote context for the eggs remote functions.
 */
export const eggsRemoteContext = {
	hatchEgg: fakeRemoteCall<HatchEggDefinition>("hatchEgg"),
};
