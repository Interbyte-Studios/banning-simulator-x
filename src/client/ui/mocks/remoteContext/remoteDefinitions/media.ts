import { RedeemCodeDefinition } from "shared/remotes/media/redeemCode";
import { VerifyDiscordDefinition } from "shared/remotes/media/verifyDiscord";

import { fakeFunctionCall } from "../fakeFunctionCall";

/**
 *  This is the remote context for the media remote functions.
 */
export const mediaRemoteContext = {
	redeemCode: fakeFunctionCall<RedeemCodeDefinition>("redeemCode", () => {
		return {
			success: true,
		};
	}),

	verifyDiscord: fakeFunctionCall<VerifyDiscordDefinition>("verifyDiscord", () => {
		return {
			success: true,
		};
	}),
};
