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
		zones: [
			"Forest",
			// /*
			"Beach",
			"Candy Land",
			"Desert",
			"Forest",
			"Honeycomb",
			"Ice Land",
			"Lava Lands",
			"Sunflower Field",
			"The Mines",
			// */
		],
	},
];

/**
 * Purchases a zone, saving it to players owned zones.
 *
 * @param data The data associated with the zone purchase.
 * @returns The Rodux action to dispatch.
 */
export function unlockZone(data: Omit<UnlockZone, "type">): UnlockZone & Rodux.AnyAction {
	return {
		type: "unlockZone",
		zoneName: data.zoneName,
		worldName: data.worldName,
		currency: data.currency,
	};
}

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
		const worldDataIndex = newState.findIndex((x) => x.name === action.worldName);
		assert(
			worldDataIndex !== -1,
			`Expected to find world data for ${action.worldName} when unlocking zone ${action.zoneName}`,
		);

		const newWorldData = { ...newState[worldDataIndex] };
		newState[worldDataIndex] = newWorldData;

		newWorldData.zones = [...newWorldData.zones, action.zoneName];

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
