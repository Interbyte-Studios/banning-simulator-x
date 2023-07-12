import { HttpService } from "@rbxts/services";
import { spinRewards } from "shared/configs/spinWheel";
import { Store } from "shared/rodux";
import { claimBoost } from "shared/rodux/boosts";
import { awardCurrency } from "shared/rodux/currencies";
import { AddedPet, addPets } from "shared/rodux/pets";
import { updateWheelTime, updateWheelUses } from "shared/rodux/spinWheel";
import { getPetData } from "shared/util/getPetData";

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
 * @param rewardIndex The index of the reward won.
 */
export function spinWheelReward(store: Store, rewardIndex: number): void {
	const rewardData = spinRewards[rewardIndex];
	if (rewardData === undefined) {
		warn(`Could not find data for spin reward of index ${rewardIndex}`);
		return;
	}

	if (rewardData.rewardType === "boosts") {
		store.dispatch(
			claimBoost(rewardData.rewardData.boostName ?? "x2 Currency", rewardData.rewardData.boostAmount ?? 15, 0),
		);
	} else if (rewardData.rewardType === "pet") {
		if (rewardData.rewardData.petId === undefined) {
			return;
		}

		const petData = getPetData(rewardData.rewardData.petId);
		const selectedPets: Array<AddedPet> = [];

		selectedPets.push({
			id: petData.id,
			guid: HttpService.GenerateGUID(false),
			variant: "regular",
			tradeLocked: false,
		});

		store.dispatch(addPets(selectedPets));
	} else if (rewardData.rewardType === "currency") {
		store.dispatch(awardCurrency(rewardData.rewardData.name ?? "coins", rewardData.rewardData.amount ?? 1));
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

	spinWheelReward(store, prizeWon);
	return { reward: prizeWon };
}
