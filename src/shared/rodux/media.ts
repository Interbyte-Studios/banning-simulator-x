import Rodux from "@rbxts/rodux";
import { Currency } from "shared/configs/currencies";
import { BoostProduct } from "shared/configs/game";
import { Variants } from "shared/configs/pets";

import { ValidBoostTime } from "./boosts";

export interface codeData {
	name: string;
	currency?: { name: Currency; amount: number };
	boosts?: { name: BoostProduct; time: ValidBoostTime };
	pet?: { id: number; guid: string; variant: Variants };
	experience?: number;
}

export interface MediaState {
	discordVerified: boolean;
	codes: Array<string>;
}
export type MediaActions = VerifyDiscord | RedeemCode;

interface VerifyDiscord extends Rodux.Action<"verifyDiscord"> {}
export interface RedeemCode extends codeData, Rodux.Action<"redeemCode"> {}

/**
 * Enables discord verification on the users account.
 *
 * @returns The Rodux action to dispatch.
 */
export function verifyDiscord(): VerifyDiscord & Rodux.AnyAction {
	return {
		type: "verifyDiscord",
	};
}

/**
 * Redeems a code on the users account.
 *
 * @param name The name of the code to redeem.
 * @param currency Field containing currency to reward (optional).
 * @param currency.name The name of the currency to reward.
 * @param currency.amount The amount of currency to reward.
 * @param boosts Field containing boosts to reward (optional).
 * @param boosts.name The name of the boost to reward.
 * @param boosts.time The amount of time to award the boost for.
 * @param pet The id of the pet to reward (optional).
 * @param pet.id The id of the pet to reward.
 * @param pet.guid The unique guid of the pet to reward.
 * @param pet.variant The variant of the pet to reward.
 * @param experience The amount of experience to reward (optional).
 * @returns The Rodux action to dispatch.
 */
export function redeemCode(
	name: string,
	currency?: { name: Currency; amount: number },
	boosts?: { name: BoostProduct; time: ValidBoostTime },
	pet?: { id: number; guid: string; variant: Variants },
	experience?: number,
): RedeemCode & Rodux.AnyAction {
	return {
		type: "redeemCode",
		name,
		currency,
		boosts,
		pet,
		experience,
	};
}

export const defaultMediaState = {
	discordVerified: false,
	codes: [],
};

/* eslint-disable jsdoc/require-jsdoc */
export const mediaReducer = Rodux.createReducer<MediaState, MediaActions>(defaultMediaState, {
	verifyDiscord: (state) => {
		return {
			...state,
			discordVerified: true,
		};
	},
	redeemCode: (state, action) => {
		const newState = { ...state };
		newState.codes.push(action.name);

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
