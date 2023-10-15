debug.setmemorycategory("leaderboardsHandler");
import { Players, ReplicatedStorage, RunService } from "@rbxts/services";
import { onStoreCreated } from "server/playerStore";
import {
	BANS_LEADERBOARD_ODS,
	EGGS_LEADERBOARD_ODS,
	LEADERBOARD_UPDATE_INTERVAL,
	REBIRTH_LEADERBOARD_ODS,
} from "shared/configs/game";

import { LeaderboardDataStore } from "./leaderboardClass";

const bansOds = new LeaderboardDataStore(BANS_LEADERBOARD_ODS);
const eggsOds = new LeaderboardDataStore(EGGS_LEADERBOARD_ODS);
const rebirthsOds = new LeaderboardDataStore(REBIRTH_LEADERBOARD_ODS);
const connectionMaids: Map<number, RBXScriptConnection> = new Map();

Players.PlayerAdded.Connect(async (player) => {
	const store = await onStoreCreated(player);
	const playerId = tostring(player.UserId);

	task.defer(async () => {
		const { bans, eggs, rebirths } = store.getState();
		await bansOds.setAsync(playerId, bans.allTimeBans);
		await eggsOds.setAsync(playerId, eggs.eggs);
		await rebirthsOds.setAsync(playerId, rebirths.rebirth);
	});

	let lastUpdateTime = time();
	const updateConnection = RunService.Heartbeat.Connect(() => {
		const now = time();
		if (now - lastUpdateTime < LEADERBOARD_UPDATE_INTERVAL) {
			return;
		}

		lastUpdateTime = now;

		const { bans, eggs, rebirths } = store.getState();
		task.defer(async () => {
			await bansOds.setAsync(playerId, bans.allTimeBans);
			await eggsOds.setAsync(playerId, eggs.eggs);
			await rebirthsOds.setAsync(playerId, rebirths.rebirth);
		});
	});
	connectionMaids.set(player.UserId, updateConnection);
});

Players.PlayerRemoving.Connect((player) => {
	const connectionsMaid = connectionMaids.get(player.UserId);
	if (connectionsMaid) {
		connectionsMaid.Disconnect();
		connectionMaids.delete(player.UserId);
	}
});

// eslint-disable-next-line no-constant-condition
while (true) {
	const now = time();
	task.wait(LEADERBOARD_UPDATE_INTERVAL);

	ReplicatedStorage.leaderboards.bans.GetChildren().forEach((child) => child.Destroy());
	ReplicatedStorage.leaderboards.eggs.GetChildren().forEach((child) => child.Destroy());
	ReplicatedStorage.leaderboards.rebirths.GetChildren().forEach((child) => child.Destroy());

	bansOds
		.getSortedAsync(false, 100)
		.andThen((data) =>
			data.forEach((playerData, playerPosition) => {
				const playerConfig = new Instance("Configuration");
				playerConfig.Name = playerData[0];
				playerConfig.Parent = ReplicatedStorage.leaderboards.bans;

				playerConfig.SetAttribute("amount", playerData[1]);
				playerConfig.SetAttribute("position", playerPosition + 1);
			}),
		)
		.catch((err) => warn(`Failed to update bans leaderboard: ${err}`));

	eggsOds
		.getSortedAsync(false, 100)
		.andThen((data) =>
			data.forEach((playerData, playerPosition) => {
				const playerConfig = new Instance("Configuration");
				playerConfig.Name = playerData[0];
				playerConfig.Parent = ReplicatedStorage.leaderboards.eggs;

				playerConfig.SetAttribute("amount", playerData[1]);
				playerConfig.SetAttribute("position", playerPosition + 1);
			}),
		)
		.catch((err) => warn(`Failed to update eggs leaderboard: ${err}`));

	rebirthsOds
		.getSortedAsync(false, 100)
		.andThen((data) =>
			data.forEach((playerData, playerPosition) => {
				const playerConfig = new Instance("Configuration");
				playerConfig.Name = playerData[0];
				playerConfig.Parent = ReplicatedStorage.leaderboards.rebirths;

				playerConfig.SetAttribute("amount", playerData[1]);
				playerConfig.SetAttribute("position", playerPosition + 1);
			}),
		)
		.catch((err) => warn(`Failed to update rebirths leaderboard: ${err}`));

	ReplicatedStorage.leaderboards.timeUpdated.Value = now;
}
