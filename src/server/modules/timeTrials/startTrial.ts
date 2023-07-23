import { Janitor } from "@rbxts/janitor";

import { currentTimeTrials, TimeTrialStatus } from ".";

/**
 * Starts a time trial for a certain player.
 *
 * @param player The player to start the time trial for.
 * @returns A function which is called each step of the game to
 * update the player's progress in the trial. The return result of this handler
 * indicates if the time trial has ran out of time.
 */
export function startTrial(player: Player): {
	cleanupHandler: Janitor;
	stepHandler: (step: number) => boolean;
} {
	const playerTrial = currentTimeTrials.get(player);
	assert(
		playerTrial?.status === TimeTrialStatus.WaitingForStart,
		`Attempt to start time trial for ${player}, but their status is ${playerTrial?.status}`,
	);

	// update the status of the time trial
	currentTimeTrials.set(player, {
		...playerTrial,
		status: TimeTrialStatus.Ongoing,
	});

	return {
		cleanupHandler: playerTrial.cleanupHandler,
		/**
		 * A callback which should be fired each time the game steps.
		 *
		 * @param step The amount of time that elapsed since the last step.
		 * @returns If the time trial has completed.
		 */
		stepHandler: (step: number): boolean => {
			const currentTrial = currentTimeTrials.get(player);
			assert(currentTrial !== undefined, `Attempt to step player ${player}'s trial, but they didn't have one`);

			currentTimeTrials.set(player, {
				...currentTrial,
				timeRemaining: currentTrial.timeRemaining - step,
			});

			player.SetAttribute("timeTrialTimer", currentTrial.timeRemaining);

			// return if we have finished the time trial.
			return currentTrial.timeRemaining - step <= 0;
		},
	};
}
