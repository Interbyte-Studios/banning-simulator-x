import { FusionRequestDefinition } from "shared/remotes/fusing";

import { fakeFunctionCall } from "../fakeFunctionCall";

/**
 *  This is the remote context for the fusion remote functions.
 */
export const fusionRemoteContext = {
	requestFusion: fakeFunctionCall<FusionRequestDefinition>("requestFusion", () => {
		return {
			success: true,
		};
	}),
};
