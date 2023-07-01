import Rodux from "@rbxts/rodux";

export type GameVersionsPlayedState = Set<string>;

export type GameVersionsPlayedActions = LogGameVersion;

interface LogGameVersion extends Rodux.Action<"logGameVersion"> {
	version: string;
}

/**
 * @param version The version to log.
 * @returns The Rodux action to dispatch.
 */
export function logGameVersion(version: string): LogGameVersion & Rodux.AnyAction {
	return {
		type: "logGameVersion",
		version,
	};
}

export const defaultGameVersionsPlayedState: GameVersionsPlayedState = new Set();
/* eslint-disable jsdoc/require-jsdoc */
export const gameVersionsPlayedReducer = Rodux.createReducer<GameVersionsPlayedState, GameVersionsPlayedActions>(
	defaultGameVersionsPlayedState,
	{
		logGameVersion: (state, action) => {
			return new Set([...state, action.version]);
		},
	},
);
/* eslint-enable jsdoc/require-jsdoc */
