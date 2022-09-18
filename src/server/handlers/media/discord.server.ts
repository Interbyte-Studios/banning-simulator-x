import { checkDiscordVerification } from "server/modules/rodux/verifyDiscord";
import { remotes } from "shared/remotes";

import { withPlayerStore } from "../../modules/net/withPlayerStore";

remotes.Server.GetNamespace("media")
	.Create("verifyDiscord")
	.SetCallback(withPlayerStore((player, store, tag) => checkDiscordVerification(player, store, tag)));
