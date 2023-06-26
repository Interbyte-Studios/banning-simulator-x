import { HttpService } from "@rbxts/services";
import { RedeemCodeFailKind } from "shared/remotes/media/redeemCode";
import { Store } from "shared/rodux";
import { storeBoost } from "shared/rodux/boosts";
import { awardCurrency } from "shared/rodux/currencies";
import { redeemCode } from "shared/rodux/media";
import { addPets, ConfirmedPet } from "shared/rodux/pets";

import { getCodesCache } from "../datastore/codes";

/**
 * Redeems a code.
 *
 * @param store The player store.
 * @param code The code to redeem.
 * @returns Whether or not the code was redeemed.
 */
export function checkRedeemCode(
	store: Store,
	code: string,
): { success: true } | { success: false; reason: RedeemCodeFailKind } {
	const codesCache = getCodesCache();

	const codeData = codesCache.find((activeCode) => activeCode.name === code);
	if (codeData === undefined) {
		return {
			success: false,
			reason: RedeemCodeFailKind.InvalidCode,
		};
	}

	const alreadyRedeemed = store.getState().media.codes.includes(code);
	if (alreadyRedeemed) {
		return {
			success: false,
			reason: RedeemCodeFailKind.AlreadyRedeemed,
		};
	}

	store.dispatch(redeemCode(codeData.name));

	for (const boostReward of codeData.reward.boosts) {
		store.dispatch(storeBoost(boostReward.name, boostReward.time));
	}

	if (codeData.reward.currency.amount > 0) {
		store.dispatch(awardCurrency(codeData.reward.currency.name, codeData.reward.currency.amount));
	}

	const petsToAdd: Array<ConfirmedPet> = [];
	for (const pet of codeData.reward.pets) {
		petsToAdd.push({
			id: pet.id,
			variant: pet.variant,
			method: "hatch",
			tradeLocked: false,
			autoDeleted: false,
			guid: HttpService.GenerateGUID(false),
		});
	}

	store.dispatch(addPets(0, "coins", petsToAdd));
	store.dispatch(redeemCode(code));

	return {
		success: true,
	};
}
