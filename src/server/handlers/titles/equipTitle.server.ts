import { remotes } from "shared/remotes";

import { withPlayerStore } from "../../modules/net/withPlayerStore";
import { equipTitle } from "../../modules/rodux/equipTitle";

remotes.Server.Create("equipTitle").Connect(withPlayerStore((_, store, title) => equipTitle(store, title)));
