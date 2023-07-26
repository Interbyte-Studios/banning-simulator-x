import { Janitor } from "@rbxts/janitor";
import { ReplicatedStorage, ServerStorage, Workspace } from "@rbxts/services";
import { TIME_TRIAL_LENGTH, TimeTrialDifficulty } from "shared/configs/timeTrials";

import { currentTimeTrials, TimeTrialStatus } from ".";

const ACTIVE_TRIALS: Array<{ index: number; pos: CFrame }> = [];

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
	const trialMap = ServerStorage.timeTrials.map;

	let index = 0;
	let newLocation: CFrame | undefined;
	for (let i = 1; i <= 10; i++) {
		const location = ServerStorage.timeTrials.startCreationLocation.CFrame.mul(
			new CFrame(0, 0, (trialMap.GetBoundingBox()[1].Z + GAP_BETWEEN_TRIALS) * i),
		);
		if (!ACTIVE_TRIALS.some((trial) => trial.pos.Position.sub(location.Position).Magnitude <= GAP_BETWEEN_TRIALS)) {
			index = i;
			newLocation = location;
			ACTIVE_TRIALS.push({
				index: i,
				pos: location,
			});
			break;
		}
	}
	assert(newLocation, `Failed to find a new location for ${trialMap.GetFullName()}`);

	const cleanup = new Janitor();
	cleanup.Add(() => currentTimeTrials.delete(player));

	const playerTimeTrial = trialMap.Clone();
	cleanup.Add(playerTimeTrial);
	cleanup.Add(() => {
		const cachedTrialIndex = ACTIVE_TRIALS.findIndex((trial) => trial.index === index);
		if (cachedTrialIndex !== undefined) {
			ACTIVE_TRIALS.unorderedRemove(cachedTrialIndex);
		}
	});

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
