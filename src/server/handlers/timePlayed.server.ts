import { playerStores } from "server/playerStore";
import { addTimePlayed } from "shared/rodux/playerIndex/timePlayed";

task.spawn(() => {
	// eslint-disable-next-line no-constant-condition
	while (true) {
		for (const [, store] of playerStores) {
			store.dispatch(addTimePlayed());
		}
		task.wait(1);
	}
});
