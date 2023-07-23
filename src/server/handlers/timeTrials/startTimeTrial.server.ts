import { Players, ServerStorage, Workspace } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { TIME_TRIAL_LENGTH, TIME_TRIAL_TIMER_ATTRIBUTE } from "shared/configs/timeTrials";
import { remotes } from "shared/remotes";

const currentTimeTrials: Map<Player, Model> = new Map();

/**
 * The amount of studs to have as a gap between time trials spawned.
 */
const GAP_BETWEEN_TRIALS = 100;

assert(
	ServerStorage.timeTrials.map.IsA("Model"),
	`Expected ${ServerStorage.timeTrials.map.GetFullName()} to be a model, but it wasn't`,
);

remotes.Server.GetNamespace("timeTrials")
	.Get("startTimeTrial")
	.Connect(
		withPlayerStore((player, store, difficulty) => {
			// prevent player from having two time trials
			if (currentTimeTrials.has(player)) {
				return;
			}

			// create a map for the player
			const playerTimeTrial = ServerStorage.timeTrials.map.Clone();

			const newLocation = ServerStorage.timeTrials.startCreationLocation.CFrame.add(
				new Vector3(0, 0, playerTimeTrial.GetBoundingBox()[1].Z + GAP_BETWEEN_TRIALS).mul(currentTimeTrials.size()),
			);
			playerTimeTrial.PivotTo(newLocation);
			playerTimeTrial.Parent = Workspace;

			// start a timer
			player.SetAttribute(TIME_TRIAL_TIMER_ATTRIBUTE, TIME_TRIAL_LENGTH);

			currentTimeTrials.set(player, playerTimeTrial);
		}),
	);

Players.PlayerRemoving.Connect((player) => {
	const playerMap = currentTimeTrials.get(player);
	if (playerMap !== undefined) {
		// we need to clean up the time trial
		currentTimeTrials.delete(player);
		playerMap.Destroy();
	}
});
