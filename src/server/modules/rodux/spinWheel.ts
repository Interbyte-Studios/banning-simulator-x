import { Store } from "shared/rodux";
import { updateWheelTime, updateWheelUses } from "shared/rodux/spinWheel";

// Values
const spinWaitTime = 60 * 60;
const spinDayTime = 24 * (60 * 60);

/**
 *
 * @param store The store of the player.
 */
export function updateSpinWheelInfo(store: Store): void {
	const spinWheel = store.getState().spinWheel;
	const currentTime = DateTime.now().UnixTimestamp;

	if (spinWheel.spinsDone === 0) {
		store.dispatch(updateWheelTime(currentTime, currentTime, currentTime + spinDayTime));
		return;
	}

	if (spinWheel.spinsDone < 6) {
		return;
	}

	if (currentTime > spinWheel.dayEndTime) {
		store.dispatch(updateWheelTime(currentTime, currentTime + spinWaitTime, currentTime + spinDayTime));
		store.dispatch(updateWheelUses(0));
		return;
	}
}

/**
 *
 * @param store The current store of the player.
 * @returns The reward of the player.
 */
export function spinWheel(store: Store): { reward: number | undefined } {
	const spinWheel = store.getState().spinWheel;
	const currentTime = DateTime.now().UnixTimestamp;
	const prizeWon = new Random().NextInteger(1, 8);

	updateSpinWheelInfo(store);

	if (spinWheel.spinsDone === 6) {
		return { reward: undefined };
	}

	if (currentTime < spinWheel.endTime) {
		return { reward: undefined };
	}

	store.dispatch(updateWheelTime(currentTime, currentTime + spinWaitTime, spinWheel.dayEndTime));
	store.dispatch(updateWheelUses(spinWheel.spinsDone + 1));

	return { reward: prizeWon };
}
