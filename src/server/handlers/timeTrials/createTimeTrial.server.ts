import { Players, ServerStorage } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { cleanupTrial, createTrial, getTrialStatus } from "server/modules/timeTrials/createTrial";
import { TIME_TRIAL_TIMER_ATTRIBUTE, TIME_TRIAL_WAITING_ATTRIBUTE } from "shared/configs/timeTrials";
import { remotes } from "shared/remotes";

assert(
	ServerStorage.timeTrials.map.IsA("Model"),
	`Expected ${ServerStorage.timeTrials.map.GetFullName()} to be a model, but it wasn't`,
);
assert(
	ServerStorage.timeTrials.map.FindFirstChildWhichIsA("SpawnLocation"),
	`Failed to find SpawnLocation in time trial for ${ServerStorage.timeTrials.map.GetFullName()}`,
);

remotes.Server.GetNamespace("timeTrials")
	.Get("createTimeTrial")
	.Connect(
		withPlayerStore((player, store, difficulty) => {
			// prevent player from having two time trials
			if (getTrialStatus(player) !== undefined) {
				return;
			}

			// ensure player had a root part
			const humanoid = player.Character?.FindFirstAncestorWhichIsA("Humanoid");
			const rootPart = humanoid?.RootPart;
			if (!(humanoid && humanoid.Health > 0 && rootPart)) {
				return;
			}

			const { cleanupHandler, spawnLocation } = createTrial(player, difficulty);
			rootPart.CFrame = spawnLocation;

			// if player dies, then we cleanup immediately
			// player receives nothing in this case
			cleanupHandler.Add(
				humanoid.Died.Once(() => {
					cleanupHandler.Cleanup();
				}),
			);

			// set timer to initial value
			player.SetAttribute(TIME_TRIAL_TIMER_ATTRIBUTE, TIME_TRIAL_WAITING_ATTRIBUTE);
		}),
	);

Players.PlayerRemoving.Connect((player) => {
	cleanupTrial(player);
});
