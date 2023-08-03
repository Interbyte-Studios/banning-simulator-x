debug.setmemorycategory("startTimeTrial");
import { RunService } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { currentTimeTrials, TimeTrialStatus } from "server/modules/timeTrials";
import { getTrialStatus } from "server/modules/timeTrials/createTrial";
import { startTrial } from "server/modules/timeTrials/startTrial";
import { TIME_TRIAL_DIFFICULTY_ATTRIBUTE, TIME_TRIAL_TIMER_ATTRIBUTE } from "shared/configs/timeTrials";
import { remotes } from "shared/remotes";
import { awardCurrency } from "shared/rodux/currencies";
import { equipWeapon } from "shared/rodux/currentWeapon";
import { setHighestHardWave } from "shared/rodux/timeTrials";

remotes.Server.GetNamespace("timeTrials")
	.Get("startTimeTrial")
	.Connect(
		withPlayerStore((player, store) => {
			if (getTrialStatus(player) !== TimeTrialStatus.WaitingForStart) {
				return;
			}

			store.dispatch(equipWeapon());

			const { cleanupHandler, stepHandler } = startTrial(player);
			cleanupHandler.Add(
				RunService.Heartbeat.Connect((delta) => {
					const didComplete = stepHandler(delta);

					if (didComplete) {
						const trials = currentTimeTrials.get(player);
						assert(trials, `Failed to find difficulty for ${player} in time trial`);

						const difficulty = trials.difficulty;
						const wave = trials.wave;

						cleanupHandler.Cleanup();

						player.SetAttribute(TIME_TRIAL_TIMER_ATTRIBUTE, undefined);
						player.SetAttribute(TIME_TRIAL_DIFFICULTY_ATTRIBUTE, undefined);

						// todo: compute rewards, give them to player, tell player
						const difficultyMultiplier = difficulty === "easy" ? 1.25 : difficulty === "medium" ? 1.3 : 1.35;
						const waveMultiplier = 5 * wave;
						store.dispatch(awardCurrency("gears", waveMultiplier * difficultyMultiplier ** wave));

						if (difficulty === "hard") {
							if (wave > store.getState().timeTrials["Ban Land"].highestHardWave) {
								store.dispatch(setHighestHardWave("Ban Land", wave));
							}
						}
					}
				}),
			);
		}),
	);
