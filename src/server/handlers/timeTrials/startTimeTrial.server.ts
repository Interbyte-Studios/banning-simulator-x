import { RunService } from "@rbxts/services";
import { TimeTrialStatus } from "server/modules/timeTrials";
import { getTrialStatus } from "server/modules/timeTrials/createTrial";
import { startTrial } from "server/modules/timeTrials/startTrial";
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
					player.LoadCharacter();

					// todo: compute rewards, give them to player, tell player
				}
			}),
		);
	});
