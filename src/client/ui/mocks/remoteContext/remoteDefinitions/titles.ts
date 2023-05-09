import { EquipTitleDefinition } from "shared/remotes/equipTitle";

import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 *  This is the remote context for the titles remote functions.
 */
export const titlesRemoteContext = {
	equipTitle: fakeRemoteCall<EquipTitleDefinition>("equipTitle"),
};
