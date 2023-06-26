import Rodux from "@rbxts/rodux";

export interface codeData {
	name: string;
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
 * @returns The Rodux action to dispatch.
 */
export function redeemCode(name: string): RedeemCode & Rodux.AnyAction {
	return {
		type: "redeemCode",
		name,
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
