import { Players, ServerStorage } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { currentTimeTrials } from "server/modules/timeTrials";
import { cleanupTrial, createTrial, getTrialStatus } from "server/modules/timeTrials/createTrial";
import {
	TIME_TRIAL_DIFFICULTY_ATTRIBUTE,
	TIME_TRIAL_TIMER_ATTRIBUTE,
	TIME_TRIAL_WAITING_ATTRIBUTE,
	TIME_TRIAL_WAVE_ATTRIBUTE,
} from "shared/configs/timeTrials";
import { remotes } from "shared/remotes";
import { awardCurrency } from "shared/rodux/currencies";
import { equipWeapon } from "shared/rodux/currentWeapon";
import { setHighestHardWave } from "shared/rodux/timeTrials";

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
	.SetCallback(
		withPlayerStore((player, store, difficulty) => {
			// prevent player from having two time trials
			if (getTrialStatus(player) !== undefined) {
				return {
					success: false,
				};
			}

			// ensure player had a root part
			const humanoid = player.Character?.FindFirstChildOfClass("Humanoid");
			const rootPart = humanoid?.RootPart;
			if (!(humanoid && humanoid.Health > 0 && rootPart)) {
				return {
					success: false,
				};
			}

			const { cleanupHandler, spawnLocation } = createTrial(player, difficulty);
			store.dispatch(equipWeapon());

			// if player dies, then we cleanup immediately
			// player receives nothing in this case
			cleanupHandler.Add(
				humanoid.Died.Once(() => {
					const playerTrial = currentTimeTrials.get(player);
					if (playerTrial !== undefined) {
						const difficultyMultiplier =
							playerTrial.difficulty === "easy" ? 1.25 : playerTrial.difficulty === "medium" ? 1.35 : 1.45;
						const waveMultiplier = 5 * playerTrial.wave;
						store.dispatch(awardCurrency("gears", waveMultiplier * difficultyMultiplier ** playerTrial.wave));
					}

					cleanupHandler.Cleanup();
				}),
			);

			humanoid.MaxHealth = 100 + 50 * store.getState().timeTrials["Ban Land"].health;
			humanoid.Health = humanoid.MaxHealth;

			// set timer to initial value
			player.SetAttribute(TIME_TRIAL_TIMER_ATTRIBUTE, TIME_TRIAL_WAITING_ATTRIBUTE);
			player.SetAttribute(TIME_TRIAL_DIFFICULTY_ATTRIBUTE, difficulty);
			player.SetAttribute(TIME_TRIAL_WAVE_ATTRIBUTE, difficulty);

			return {
				success: true,
				spawnLocation: spawnLocation.Position,
			};
		}),
	);

remotes.Server.GetNamespace("timeTrials")
	.Get("stopTimeTrial")
	.Connect(
		withPlayerStore((player, store) => {
			const playerTrial = currentTimeTrials.get(player);
			if (playerTrial !== undefined) {
				const difficultyMultiplier =
					playerTrial.difficulty === "easy" ? 1.25 : playerTrial.difficulty === "medium" ? 1.35 : 1.45;
				const waveMultiplier = 5 * playerTrial.wave;
				store.dispatch(awardCurrency("gears", waveMultiplier * difficultyMultiplier ** playerTrial.wave));

				if (playerTrial.difficulty === "hard") {
					if (playerTrial.wave > store.getState().timeTrials["Ban Land"].highestHardWave) {
						store.dispatch(setHighestHardWave("Ban Land", playerTrial.wave));
					}
				} else warn(`Difficulty was: ${playerTrial.difficulty}`);
			}
			cleanupTrial(player);

			store.dispatch(equipWeapon());
			player.SetAttribute(TIME_TRIAL_TIMER_ATTRIBUTE, undefined);
			player.SetAttribute(TIME_TRIAL_DIFFICULTY_ATTRIBUTE, undefined);
		}),
	);

Players.PlayerRemoving.Connect((player) => {
	cleanupTrial(player);
});
