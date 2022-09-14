import Rodux from "@rbxts/rodux";

export interface MediaState {
	discord: boolean;
	twitter: boolean;
}
export type MediaActions = VerifyDiscord | VerifyTwitter;

interface VerifyDiscord extends Rodux.Action<"verifyDiscord"> {}
interface VerifyTwitter extends Rodux.Action<"verifyTwitter"> {}

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
 * Enables twitter verification on the users account.
 *
 * @returns The Rodux action to dispatch.
 */
export function verifyTwitter(): VerifyTwitter & Rodux.AnyAction {
	return {
		type: "verifyTwitter",
	};
}

const defaultState = {
	discord: false,
	twitter: false,
};

/* eslint-disable jsdoc/require-jsdoc */
export const mediaReducer = Rodux.createReducer<MediaState, MediaActions>(defaultState, {
	verifyDiscord: (state) => {
		const newState = { ...state };
		newState.discord = true;

		return newState;
	},
	verifyTwitter: (state) => {
		const newState = { ...state };
		newState.twitter = true;

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
