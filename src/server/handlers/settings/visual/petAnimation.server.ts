import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { togglePetAnimationType } from "shared/rodux/settings";

const togglePetAnimationTypeRemote = remotes.Server.GetNamespace("settings")
	.GetNamespace("visual")
	.Get("togglePetAnimationType");
togglePetAnimationTypeRemote.Connect(
	withPlayerStore((_, store, animationType) => store.dispatch(togglePetAnimationType(animationType))),
);
