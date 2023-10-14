debug.setmemorycategory("startTimeTrial");
import { RunService } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { hatchHatchableEgg } from "server/modules/pets/hatchEgg";
import { currentTimeTrials, TimeTrialStatus } from "server/modules/timeTrials";
import { getTrialStatus } from "server/modules/timeTrials/createTrial";
import { startTrial } from "server/modules/timeTrials/startTrial";
import { TIME_TRIAL_DIFFICULTY_ATTRIBUTE, TIME_TRIAL_EGG, TIME_TRIAL_TIMER_ATTRIBUTE } from "shared/configs/timeTrials";
import { remotes } from "shared/remotes";
import { Store } from "shared/rodux";
import { awardCurrency } from "shared/rodux/currencies";
import { equipWeapon } from "shared/rodux/currentWeapon";
import { hatchEgg } from "shared/rodux/eggs";

const timeTrialsNamespace = remotes.Server.GetNamespace("timeTrials");
const startTimeTrial = timeTrialsNamespace.Get("startTimeTrial");

const eggsNamespace = remotes.Server.GetNamespace("eggs");
const conveyHatch = eggsNamespace.Get("conveyHatch");

/**
 * @param player The player to handle a time trial for.
 * @param store The player's rodux store.
 */
function handleTimeTrial(player: Player, store: Store): void {
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

				player.SetAttribute(TIME_TRIAL_TIMER_ATTRIBUTE, undefined);
				player.SetAttribute(TIME_TRIAL_DIFFICULTY_ATTRIBUTE, undefined);

				const currentState = store.getState();
				const currencyMultiplier = currentState.rebirths.currencyMultipliers.gears * 0.3;

				const difficultyMultiplier = difficulty === "easy" ? 1.25 : difficulty === "medium" ? 1.3 : 1.35;
				const waveMultiplier = 5 * wave;

				const reward = waveMultiplier * difficultyMultiplier ** wave;
				const rewardWithMultiplier = reward + reward * currencyMultiplier;
				store.dispatch(awardCurrency("gears", rewardWithMultiplier));

				// clear all the npc parts
				for (const npc of trials.npcs) {
					npc.instance.Destroy();
				}

				if (trials.difficulty === "easy") {
					// find the eggs to hatch
					const hatchedEggs = hatchHatchableEgg(player, currentState, TIME_TRIAL_EGG, 1, "regular");

					// dispatch the pets
					store.dispatch(hatchEgg(0, "coins", hatchedEggs));
					conveyHatch.SendToPlayer(player, TIME_TRIAL_EGG, hatchedEggs, false);
				} else if (trials.difficulty === "medium") {
					// find the eggs to hatch
					const hatchedEggs = hatchHatchableEgg(player, currentState, TIME_TRIAL_EGG, 3, "regular");

					// dispatch the pets
					store.dispatch(hatchEgg(0, "coins", hatchedEggs));
					conveyHatch.SendToPlayer(player, TIME_TRIAL_EGG, hatchedEggs, false);
				} else if (trials.difficulty === "hard") {
					// find the eggs to hatch
					const hatchedEggs = hatchHatchableEgg(player, currentState, TIME_TRIAL_EGG, 5, "regular");

					// dispatch the pets
					store.dispatch(hatchEgg(0, "coins", hatchedEggs));
					conveyHatch.SendToPlayer(player, TIME_TRIAL_EGG, hatchedEggs, false);
				}

				cleanupHandler.Cleanup();
			}
		}),
	);
}

startTimeTrial.Connect(withPlayerStore(handleTimeTrial));
