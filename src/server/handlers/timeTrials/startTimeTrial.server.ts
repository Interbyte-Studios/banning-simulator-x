import { RunService } from "@rbxts/services";
import { TimeTrialStatus } from "server/modules/timeTrials";
import { getTrialStatus } from "server/modules/timeTrials/createTrial";
import { startTrial } from "server/modules/timeTrials/startTrial";
import { TIME_TRIAL_DIFFICULTY_ATTRIBUTE, TIME_TRIAL_TIMER_ATTRIBUTE } from "shared/configs/timeTrials";
import { remotes } from "shared/remotes";

remotes.Server.GetNamespace("timeTrials")
	.Get("startTimeTrial")
	.Connect((player) => {
		if (getTrialStatus(player) !== TimeTrialStatus.WaitingForStart) {
			return;
		}

		const { cleanupHandler, stepHandler } = startTrial(player);
		cleanupHandler.Add(
			RunService.Heartbeat.Connect((delta) => {
				const didComplete = stepHandler(delta);

				if (didComplete) {
					cleanupHandler.Cleanup();

					// move player character back to spawn
					if (player.Character) {
						const humanoid = player.Character.FindFirstChildOfClass("Humanoid");
						const rootPart = humanoid?.RootPart;
						if (rootPart) {
							rootPart.CFrame = new CFrame(new Vector3(22774.359, 43.466, -117.576));
							warn(`moved ${player.Name} back to spawn`);
						}
					}

					player.SetAttribute(TIME_TRIAL_TIMER_ATTRIBUTE, undefined);
					player.SetAttribute(TIME_TRIAL_DIFFICULTY_ATTRIBUTE, undefined);

					// todo: compute rewards, give them to player, tell player
				}
			}),
		);
	});
