import { ClaimAccoladeDefinition } from "shared/remotes/accolades/claimAccolade";

import { fakeFunctionCall } from "../fakeFunctionCall";

/**
 *  This is the remote context for the accolades remote functions.
 */
export const accoladesRemoteContext = {
	claimAccolade: fakeFunctionCall<ClaimAccoladeDefinition>("claimAccolade", () => {
		return {
			success: true,
		};
	}),
};
