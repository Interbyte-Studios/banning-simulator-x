import Rodux from "@rbxts/rodux";
import { Currency } from "shared/configs/currencies";
import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";

export type WorldsState = Array<{
	name: WorldName;
	zones: Array<ZoneNames>;
}>;
export type WorldActions = UnlockWorld | UnlockZone;

export interface UnlockWorld extends Rodux.Action<"unlockWorld"> {
	currency: {
		amount: number;
		type: Currency;
	};
	worldName: WorldName;
	zoneName: ZoneNames;
}

export interface UnlockZone extends Rodux.Action<"unlockZone"> {
	currency: {
		amount: number;
		type: Currency;
	};
	worldName: WorldName;
	zoneName: ZoneNames;
}

const defaultWorlds: WorldsState = [
	{
		name: "Ban Land",
		zones: ["Forest"],
	},
];

/* eslint-disable jsdoc/require-jsdoc */
export const worldsReducer = Rodux.createReducer<WorldsState, WorldActions>(defaultWorlds, {
	unlockWorld: (state, action) => {
		const newState = [...state];
		newState.push({
			name: action.worldName,
			zones: [action.zoneName],
		});

		return newState;
	},
	unlockZone: (state, action) => {
		const newState = [...state];

		// get existing unlocked world
		const worldData = newState.find((x) => x.name === action.worldName);
		assert(worldData, `Expected to find world data for ${action.worldName} when unlocking zone ${action.zoneName}`);

		worldData.zones = [...worldData.zones, action.zoneName];

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
