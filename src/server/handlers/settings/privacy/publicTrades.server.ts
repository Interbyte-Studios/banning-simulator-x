import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { togglePublicTradeHistory } from "shared/rodux/settings";

const togglePublicHistoryRemote = remotes.Server.GetNamespace("settings")
	.GetNamespace("privacy")
	.Get("publicTradeHistory");
togglePublicHistoryRemote.Connect(withPlayerStore((_, store) => store.dispatch(togglePublicTradeHistory())));
