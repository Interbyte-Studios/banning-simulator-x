import { remotes } from "shared/remotes";

import { withPlayerStore } from "../../modules/net/withPlayerStore";
import { equipTitle } from "../../modules/rodux/equipTitle";

remotes.Server.Create("equipTitle").Connect(
	withPlayerStore((player, store, title) => equipTitle(player, store, title)),
);
