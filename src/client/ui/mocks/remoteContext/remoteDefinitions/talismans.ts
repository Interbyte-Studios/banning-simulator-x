import { EquipTalismanDefinition } from "shared/remotes/talismans/equipTalisman";
import { PurchaseTalismanDefinition } from "shared/remotes/talismans/purchaseTalisman";
import { UnequipTalismanDefinition } from "shared/remotes/talismans/unequipTalisman";

import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 * This is the remote context for the talismans remote functions.
 */
export const talismansRemoteContext = {
	purchaseTalisman: fakeRemoteCall<PurchaseTalismanDefinition>("purchaseTalisman"),
	equipTalisman: fakeRemoteCall<EquipTalismanDefinition>("equipTalisman"),
	unequipTalisman: fakeRemoteCall<UnequipTalismanDefinition>("unequipTalisman"),
};
