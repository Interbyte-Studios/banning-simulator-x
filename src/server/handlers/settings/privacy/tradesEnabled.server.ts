import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { toggleTradesEnabled } from "shared/rodux/settings";

const tradesEnabledRemote = remotes.Server.GetNamespace("settings").GetNamespace("privacy").Get("tradesEnabled");
tradesEnabledRemote.Connect(withPlayerStore((_, store) => store.dispatch(toggleTradesEnabled())));
