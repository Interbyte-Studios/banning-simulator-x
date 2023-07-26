import { HttpService } from "@rbxts/services";
import { spinRewards } from "shared/configs/spinWheel";
import { Store } from "shared/rodux";
import { storeBoost } from "shared/rodux/boosts";
import { awardCurrency } from "shared/rodux/currencies";
import { AddedPet, addPets } from "shared/rodux/pets";
import { spinTheWheel } from "shared/rodux/spinWheel";
import { getPetData } from "shared/util/getPetData";
/**
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
			storeBoost(rewardData.rewardData.boostName ?? "x2 Currency", rewardData.rewardData.boostAmount ?? 15),
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
	if (spinWheel.spinsAvailable <= 0 && spinWheel.purchasedSpinsAvailable <= 0) {
		return { reward: undefined };
	}

	let usingPurchasedSpin = false;
	if (spinWheel.purchasedSpinsAvailable > 0) {
		usingPurchasedSpin = true;
	}

	const currentTime = DateTime.now().UnixTimestamp;
	const prizeWon = new Random().NextInteger(1, 8);
	spinWheelReward(store, prizeWon);
	store.dispatch(spinTheWheel(currentTime, usingPurchasedSpin));
	return { reward: prizeWon };
}
