import { remotes } from "shared/remotes";

import { withPlayerStore } from "./modules/net/withPlayerStore";
import { purchaseZone } from "./modules/rodux/purchaseZone";

remotes.Server.Create("purchaseZone").Connect(
	withPlayerStore((_, store, worldName, zoneName) => purchaseZone(store, worldName, zoneName)),
);
