import { checkRedeemCode } from "server/modules/rodux/redeemCode";
import { remotes } from "shared/remotes";

import { withPlayerStore } from "../../modules/net/withPlayerStore";

remotes.Server.GetNamespace("media")
	.Get("redeemCode")
	.SetCallback(withPlayerStore((_, store, code) => checkRedeemCode(store, code)));
