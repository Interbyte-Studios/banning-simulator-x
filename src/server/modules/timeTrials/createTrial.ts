import { Janitor } from "@rbxts/janitor";
import { ReplicatedStorage, ServerStorage, Workspace } from "@rbxts/services";
import { TIME_TRIAL_LENGTH, TimeTrialDifficulty } from "shared/configs/timeTrials";

import { currentTimeTrials, TimeTrialStatus } from ".";

/**
 * The amount of studs to have as a gap between time trials spawned.
 */
const GAP_BETWEEN_TRIALS = 100;

/**
 * Checks if a given player has a trial created.
 *
 * @param player The player to check has a trial.
 * @returns If the player has a time trial active.
 */
export function getTrialStatus(player: Player): TimeTrialStatus | undefined {
	return currentTimeTrials.get(player)?.status;
}

/**
 * Creates a new time trial for a given player.
 *
 * @param player The player to create the time trial for.
 * @param difficulty The difficulty of the time trial.
 * @returns The time trial spawn location and cleanup handler.
 */
export function createTrial(
	player: Player,
	difficulty: TimeTrialDifficulty,
): {
	spawnLocation: CFrame;
	cleanupHandler: Janitor;
} {
	assert(getTrialStatus(player) === undefined, `Attempted to create a trial for ${player}, but they already have one!`);

	const cleanup = new Janitor();
	cleanup.Add(() => currentTimeTrials.delete(player));

	const playerTimeTrial = ServerStorage.timeTrials.map.Clone();
	cleanup.Add(playerTimeTrial);

	const newLocation = ServerStorage.timeTrials.startCreationLocation.CFrame.mul(
		new CFrame(0, 0, (playerTimeTrial.GetBoundingBox()[1].Z + GAP_BETWEEN_TRIALS) * currentTimeTrials.size()),
	);
	playerTimeTrial.PivotTo(newLocation);
	playerTimeTrial.Parent = Workspace.trials;

	const randomNPC =
		ReplicatedStorage.assetObjects.npcs.GetChildren()[
			math.random(1, ReplicatedStorage.assetObjects.npcs.GetChildren().size() - 1)
		];

	currentTimeTrials.set(player, {
		cleanupHandler: cleanup,
		difficulty,
		wave: 1,
		status: TimeTrialStatus.WaitingForStart,
		timeRemaining: TIME_TRIAL_LENGTH,
		selectedNPC: randomNPC.Name,
		npcs: [],
		npcFolder: playerTimeTrial.npcs,
		npcSpawns: playerTimeTrial.npcSpawn,
	});

	cleanup.Add(() => currentTimeTrials.delete(player));

	// move the player there
	return {
		spawnLocation: playerTimeTrial.SpawnLocation.CFrame,
		cleanupHandler: cleanup,
	};
}

/**
 * Cleans up a player's time trial, removing the map and resetting the state.
 *
 * @param player The player to clean the time trial up for.
 */
export function cleanupTrial(player: Player): void {
	currentTimeTrials.get(player)?.cleanupHandler.Cleanup();
}
