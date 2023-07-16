import { remotes } from "shared/remotes";

import { withPlayerStore } from "../../modules/net/withPlayerStore";
import { redeemQuest } from "../../modules/rodux/redeemQuest";

remotes.Server.Get("redeemQuest").Connect(withPlayerStore((_, store, quest) => redeemQuest(store, quest)));
