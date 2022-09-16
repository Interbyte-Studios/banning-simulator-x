import Net from "@rbxts/net";

import { redeemCodeDefinition } from "./redeemCode";
import { verifyDiscordDefinition } from "./verifyDiscord";

export const media = Net.Definitions.Namespace({
	redeemCode: redeemCodeDefinition,
	verifyDiscord: verifyDiscordDefinition,
});
