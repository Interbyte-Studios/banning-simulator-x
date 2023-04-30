import { Janitor } from "@rbxts/janitor";
import { Players, RunService } from "@rbxts/services";
import { retrieveStore } from "server/playerStore";
import { BANS_LEADERBOARD_ODS, EGGS_LEADERBOARD_ODS, LEADERBOARD_UPDATE_INTERVAL } from "shared/configs/game";

import { LeaderboardDataStore } from "./leaderboardClass";

const bansOds = new LeaderboardDataStore(BANS_LEADERBOARD_ODS);
const eggsOds = new LeaderboardDataStore(EGGS_LEADERBOARD_ODS);
const connectionMaids: Map<number, Janitor<void>> = new Map();

Players.PlayerAdded.Connect(async (player) => {
	const store = retrieveStore(player);
	const playerId = tostring(player.UserId);

	const connectionsMaid = new Janitor();
	connectionsMaid.Add(async () => {
		const { bans, eggs } = store.getState();
		task.defer(async () => {
			await bansOds.setAsync(playerId, bans.bans);
			await eggsOds.setAsync(playerId, eggs.eggs);
		});
	});

	let lastUpdateTime = time();
	connectionsMaid.Add(
		RunService.Heartbeat.Connect(() => {
			const now = time();
			if (now - lastUpdateTime < LEADERBOARD_UPDATE_INTERVAL) {
				return;
			}

			lastUpdateTime = now;

			const { bans, eggs } = store.getState();
			task.defer(async () => {
				await bansOds.setAsync(playerId, bans.bans);
				await eggsOds.setAsync(playerId, eggs.eggs);
			});
		}),
	);

	connectionMaids.set(player.UserId, connectionsMaid);
});

Players.PlayerRemoving.Connect((player) => {
	const connectionsMaid = connectionMaids.get(player.UserId);
	if (connectionsMaid) {
		connectionsMaid.Cleanup();
		connectionMaids.delete(player.UserId);
	}
});

// eslint-disable-next-line no-constant-condition
while (true) {
	const currentBans = bansOds.getSortedAsync(false, 100);
	const currentEggs = eggsOds.getSortedAsync(false, 100);

	// update leaderboard models
	
}
