import { Players, ServerStorage } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { cleanupTrial, createTrial, getTrialStatus } from "server/modules/timeTrials/createTrial";
import {
	TIME_TRIAL_DIFFICULTY_ATTRIBUTE,
	TIME_TRIAL_TIMER_ATTRIBUTE,
	TIME_TRIAL_WAITING_ATTRIBUTE,
	TIME_TRIAL_WAVE_ATTRIBUTE,
} from "shared/configs/timeTrials";
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
			const humanoid = player.Character?.FindFirstChildOfClass("Humanoid");
			const rootPart = humanoid?.RootPart;
			if (!(humanoid && humanoid.Health > 0 && rootPart)) {
				return;
			}

			const { cleanupHandler, spawnLocation } = createTrial(player, difficulty);
			player.RequestStreamAroundAsync(spawnLocation.Position);
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
			player.SetAttribute(TIME_TRIAL_DIFFICULTY_ATTRIBUTE, difficulty);
			player.SetAttribute(TIME_TRIAL_WAVE_ATTRIBUTE, difficulty);
		}),
	);

remotes.Server.GetNamespace("timeTrials")
	.Get("stopTimeTrial")
	.Connect(
		withPlayerStore((player) => {
			cleanupTrial(player);

			if (player.Character) {
				const humanoid = player.Character.FindFirstChildOfClass("Humanoid");
				const rootPart = humanoid?.RootPart;
				if (rootPart) {
					const pos = new Vector3(22774.359, 43.466, -117.576);
					player.RequestStreamAroundAsync(pos);
					rootPart.CFrame = new CFrame(pos);
				}
			}

			player.SetAttribute(TIME_TRIAL_TIMER_ATTRIBUTE, undefined);
			player.SetAttribute(TIME_TRIAL_DIFFICULTY_ATTRIBUTE, undefined);
		}),
	);

Players.PlayerRemoving.Connect((player) => {
	cleanupTrial(player);
});
