debug.setmemorycategory("leaderboardsHandler");
import { Players, ReplicatedStorage, RunService } from "@rbxts/services";
import { onStoreCreated } from "server/playerStore";
import {
	BANS_LEADERBOARD_ODS,
	EGGS_LEADERBOARD_ODS,
	LEADERBOARD_UPDATE_INTERVAL,
	TIME_TRIALS_LEADERBOARD_ODS,
	WORLD_PRESTIGE_LEADERBOARD_ODS,
} from "shared/configs/game";
import { WORLDS } from "shared/configs/worlds";

import { LeaderboardDataStore } from "./leaderboardClass";

const bansOds = new LeaderboardDataStore(BANS_LEADERBOARD_ODS);
const eggsOds = new LeaderboardDataStore(EGGS_LEADERBOARD_ODS);
const timeTrialsOds = new LeaderboardDataStore(TIME_TRIALS_LEADERBOARD_ODS); // will need to set this up to support scopes for the next world update
const worldPrestigeOds = new LeaderboardDataStore(WORLD_PRESTIGE_LEADERBOARD_ODS); // will need to set this up to support scopes for the next world update
const connectionMaids: Map<number, RBXScriptConnection> = new Map();

Players.PlayerAdded.Connect(async (player) => {
	const store = await onStoreCreated(player);
	const playerId = tostring(player.UserId);

	task.defer(async () => {
		const { bans, eggs, worldPrestige, timeTrials } = store.getState();
		await bansOds.setAsync(playerId, bans);
		await eggsOds.setAsync(playerId, eggs.eggs);
		await timeTrialsOds.setAsync(playerId, timeTrials["Ban Land"].highestHardWave);
		await worldPrestigeOds.setAsync(playerId, worldPrestige["Ban Land"].currentPrestige);
	});

	let lastUpdateTime = time();
	const updateConnection = RunService.Heartbeat.Connect(() => {
		const now = time();
		if (now - lastUpdateTime < LEADERBOARD_UPDATE_INTERVAL) {
			return;
		}

		lastUpdateTime = now;

		const { bans, eggs, worldPrestige, timeTrials } = store.getState();
		task.defer(async () => {
			await bansOds.setAsync(playerId, bans);
			await eggsOds.setAsync(playerId, eggs.eggs);
			await timeTrialsOds.setAsync(playerId, timeTrials["Ban Land"].highestHardWave);
			await worldPrestigeOds.setAsync(playerId, worldPrestige["Ban Land"].currentPrestige);
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
	ReplicatedStorage.leaderboards.bans.GetChildren().forEach((child) => child.Destroy());
	ReplicatedStorage.leaderboards.eggs.GetChildren().forEach((child) => child.Destroy());

	for (const [worldName] of pairs(WORLDS)) {
		const timeTrialsFolder = ReplicatedStorage.leaderboards.timeTrials[worldName];
		timeTrialsFolder.GetChildren().forEach((child) => child.Destroy());

		const worldPrestigeFolder = ReplicatedStorage.leaderboards.worldPrestige[worldName];
		worldPrestigeFolder.GetChildren().forEach((child) => child.Destroy());
	}

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

	timeTrialsOds
		.getSortedAsync(false, 100)
		.andThen((data) =>
			data.forEach((playerData, playerPosition) => {
				const playerConfig = new Instance("Configuration");
				playerConfig.Name = playerData[0];
				playerConfig.Parent = ReplicatedStorage.leaderboards.timeTrials["Ban Land"];

				playerConfig.SetAttribute("amount", playerData[1]);
				playerConfig.SetAttribute("position", playerPosition + 1);
			}),
		)
		.catch((err) => warn(`Failed to update eggs leaderboard: ${err}`));

	worldPrestigeOds
		.getSortedAsync(false, 100)
		.andThen((data) =>
			data.forEach((playerData, playerPosition) => {
				const playerConfig = new Instance("Configuration");
				playerConfig.Name = playerData[0];
				playerConfig.Parent = ReplicatedStorage.leaderboards.worldPrestige["Ban Land"];

				playerConfig.SetAttribute("amount", playerData[1]);
				playerConfig.SetAttribute("position", playerPosition + 1);
			}),
		)
		.catch((err) => warn(`Failed to update eggs leaderboard: ${err}`));

	task.wait(1);
	ReplicatedStorage.leaderboards.timeUpdated.Value = time();
	task.wait(LEADERBOARD_UPDATE_INTERVAL);
}
