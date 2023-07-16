import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { togglePetsStudsOfDistance } from "shared/rodux/settings";

const togglePetsStudsOfDistanceRemote = remotes.Server.GetNamespace("settings")
	.GetNamespace("visual")
	.Get("togglePetsStudsOfDistance");
togglePetsStudsOfDistanceRemote.Connect(
	withPlayerStore((_, store, studs) => store.dispatch(togglePetsStudsOfDistance(studs))),
);
