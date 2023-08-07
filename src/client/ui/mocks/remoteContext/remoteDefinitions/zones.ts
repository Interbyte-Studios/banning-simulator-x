import { PurchaseWorldDefinition } from "shared/remotes/purchaseWorld";
import { PurchaseZoneDefinition } from "shared/remotes/purchaseZone";

import { fakeFunctionCall } from "../fakeFunctionCall";

/**
 * This is the remote context for the zones remote functions.
 */
export const zonesRemoteContext = {
	purchaseZone: fakeFunctionCall<PurchaseZoneDefinition>("purchaseZone", () => {
		return {
			success: true,
		};
	}),
	purchaseWorld: fakeFunctionCall<PurchaseWorldDefinition>("purchaseWorld", () => {
		return {
			success: true,
		};
	}),
};
