import { RunService } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { currentTimeTrials, TimeTrialStatus } from "server/modules/timeTrials";
import { getTrialStatus } from "server/modules/timeTrials/createTrial";
import { startTrial } from "server/modules/timeTrials/startTrial";
import { TIME_TRIAL_DIFFICULTY_ATTRIBUTE, TIME_TRIAL_TIMER_ATTRIBUTE } from "shared/configs/timeTrials";
import { remotes } from "shared/remotes";
import { awardCurrency } from "shared/rodux/currencies";

remotes.Server.GetNamespace("timeTrials")
	.Get("startTimeTrial")
	.Connect(
		withPlayerStore((player, store) => {
			if (getTrialStatus(player) !== TimeTrialStatus.WaitingForStart) {
				return;
			}

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

						// move player character back to spawn
						if (player.Character) {
							const humanoid = player.Character.FindFirstChildOfClass("Humanoid");
							const rootPart = humanoid?.RootPart;
							if (rootPart) {
								rootPart.CFrame = new CFrame(new Vector3(22774.359, 43.466, -117.576)).mul(
									new CFrame(new Vector3(0, 5, 0)),
								);
							}
						}

						player.SetAttribute(TIME_TRIAL_TIMER_ATTRIBUTE, undefined);
						player.SetAttribute(TIME_TRIAL_DIFFICULTY_ATTRIBUTE, undefined);

						// todo: compute rewards, give them to player, tell player
						const difficultyMultiplier = difficulty === "easy" ? 1.1 : difficulty === "medium" ? 1.2 : 1.25;
						const waveMultiplier = 2 * wave;
						store.dispatch(awardCurrency("gears", waveMultiplier * difficultyMultiplier ** wave));
					}
				}),
			);
		}),
	);
