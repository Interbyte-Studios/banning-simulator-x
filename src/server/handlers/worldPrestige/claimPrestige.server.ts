import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";

remotes.Server.GetNamespace("worldPrestige")
	.Get("claimPrestige")
	.Connect(
		withPlayerStore(() => {
			return;
		}),
	);
