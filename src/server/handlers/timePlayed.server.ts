import { RunService } from "@rbxts/services";
import { playerStores } from "server/playerStore";
import { addTimePlayed } from "shared/rodux/playerIndex/timePlayed";

let lastCheck = 0;
RunService.Heartbeat.Connect(() => {
	// only run once a second
	const now = time();
	if (now - lastCheck < 1) {
		return;
	}
	lastCheck = now;

	// award time played to all players
	for (const [, store] of playerStores) {
		store.dispatch(addTimePlayed());
	}
});
