import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { addOrRemoveToAutoDelete } from "shared/rodux/settings";

remotes.Server.GetNamespace("settings")
	.GetNamespace("autoDelete")
	.Get("addOrRemoveToAutoDelete")
	.Connect(withPlayerStore((_, store, petId) => store.dispatch(addOrRemoveToAutoDelete(petId))));
