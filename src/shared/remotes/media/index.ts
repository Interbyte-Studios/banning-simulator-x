import Net from "@rbxts/net";

import { redeemCodeDefinition } from "./redeemCode";

export const media = Net.Definitions.Namespace({
	redeemCode: redeemCodeDefinition,
});
