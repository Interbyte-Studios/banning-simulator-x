import { Janitor } from "@rbxts/janitor";
import { ServerStorage, Workspace } from "@rbxts/services";

/**
 * The amount of studs to have as a gap between time trials spawned.
 */
const GAP_BETWEEN_TRIALS = 100;

const currentTimeTrials: Map<Player, Janitor> = new Map();

/**
 * Checks if a given player has a trial created.
 *
 * @param player The player to check has a trial.
 * @returns If the player has a time trial active.
 */
export function hasTrial(player: Player): boolean {
	return currentTimeTrials.has(player);
}

/**
 * Creates a new time trial for a given player.
 *
 * @param player The player to create the time trial for.
 * @returns The time trial spawn location and cleanup handler.
 */
export function createTrial(player: Player): {
	spawnLocation: CFrame;
	cleanupHandler: Janitor;
} {
	assert(!hasTrial(player), `Attempted to create a trial for ${player}, but they already have one!`);

	const cleanup = new Janitor();
	currentTimeTrials.set(player, cleanup);
	cleanup.Add(() => currentTimeTrials.delete(player));

	const playerTimeTrial = ServerStorage.timeTrials.map.Clone();
	cleanup.Add(playerTimeTrial);

	const newLocation = ServerStorage.timeTrials.startCreationLocation.CFrame.mul(
		new CFrame(0, 0, (playerTimeTrial.GetBoundingBox()[1].Z + GAP_BETWEEN_TRIALS) * currentTimeTrials.size()),
	);
	playerTimeTrial.PivotTo(newLocation);
	playerTimeTrial.Parent = Workspace;

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
	currentTimeTrials.get(player)?.Cleanup();
}
