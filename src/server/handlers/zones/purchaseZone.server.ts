import { purchaseZone } from "server/modules/rodux/purchaseZone";
import { remotes } from "shared/remotes";

import { withPlayerStore } from "../../modules/net/withPlayerStore";

remotes.Server.Create("purchaseZone").SetCallback(
	withPlayerStore((_, store, worldName, zoneName) => purchaseZone(store, worldName, zoneName)),
);
