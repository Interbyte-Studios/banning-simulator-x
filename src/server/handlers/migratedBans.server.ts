/*
    This was added due to the huge balancing error for bans during the release.
    This should be removed on Update 1.
*/

import { Players } from "@rbxts/services";
import { onStoreCreated } from "server/playerStore";
import { migrateBans } from "shared/rodux/banMigration";
import { resetBans } from "shared/rodux/bans";

Players.PlayerAdded.Connect(async (player) => {
	const store = await onStoreCreated(player);

	if (store.getState().migratedBans) {
		return;
	}

	store.dispatch(resetBans());
	store.dispatch(migrateBans());
});
