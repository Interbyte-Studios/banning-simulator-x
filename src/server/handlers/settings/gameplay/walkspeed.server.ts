import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { toggleWalkSpeed } from "shared/rodux/settings";
import { getTalismanData } from "shared/util/getTalismanData";

const toggleWalkSpeedRemote = remotes.Server.GetNamespace("settings").GetNamespace("gameplay").Get("toggleWalkSpeed");
toggleWalkSpeedRemote.Connect(
	withPlayerStore((_, store, walkSpeed) => {
		if (walkSpeed < 24) {
			return;
		}

		const currentState = store.getState();
		let maxWalkSpeed = 24;

		const currentTalisman = currentState.currentTalisman;
		if (currentTalisman !== undefined) {
			const talismanData = getTalismanData(currentTalisman);
			if (talismanData !== undefined) {
				maxWalkSpeed += talismanData.stats.walkspeed;
			}
		}

		if (walkSpeed > maxWalkSpeed) {
			return;
		}

		store.dispatch(toggleWalkSpeed(walkSpeed));
	}),
);
