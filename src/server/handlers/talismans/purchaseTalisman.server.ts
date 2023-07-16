import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { purchaseTalisman } from "server/modules/rodux/purchaseTalisman";
import { remotes } from "shared/remotes";

remotes.Server.GetNamespace("talismans")
	.Get("purchaseTalisman")
	.Connect(withPlayerStore((_, store, talismanId) => purchaseTalisman(store, talismanId)));
