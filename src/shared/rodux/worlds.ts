import Rodux from "@rbxts/rodux";
import { Currency } from "shared/configs/currencies";
import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";

export type WorldsState = Array<{
	name: WorldName;
	zones: Array<ZoneNames>;
}>;
export type WorldActions = UnlockWorld | UnlockZone | ResetZones;

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

export interface ResetZones extends Rodux.Action<"resetZones"> {
	worldName: WorldName;
}

/**
 * Purchases a zone, saving it to players owned zones.
 *
 * @param data The data associated with the zone purchase.
 * @returns The Rodux action to dispatch.
 */
export function unlockWorld(data: Omit<UnlockWorld, "type">): UnlockWorld & Rodux.AnyAction {
	return {
		type: "unlockWorld",
		zoneName: data.zoneName,
		worldName: data.worldName,
		currency: data.currency,
	};
}

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

/**
 * @param worldName The name of the world to unlock.
 * @returns The Rodux action to dispatch.
 */
export function resetZones(worldName: WorldName): ResetZones & Rodux.AnyAction {
	return {
		type: "resetZones",
		worldName: worldName,
	};
}

export const defaultWorlds: WorldsState = [
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
		const worldDataIndex = newState.findIndex((x) => x.name === action.worldName);
		if (worldDataIndex === -1) {
			warn(`[ Worlds Reducer | Unlock Zone ] - Failed to find world data for ${action.worldName}.`);
			return newState;
		}

		const newWorldData = { ...newState[worldDataIndex] };
		newState[worldDataIndex] = newWorldData;

		newWorldData.zones = [...newWorldData.zones, action.zoneName];

		return newState;
	},
	resetZones: (state, action) => {
		const newState = [...state];

		// get existing unlocked world
		const worldDataIndex = newState.findIndex((x) => x.name === action.worldName);
		if (worldDataIndex === -1) {
			warn(`[ Worlds Reducer | Unlock Zone ] - Failed to find world data for ${action.worldName}.`);
			return newState;
		}

		const defaultWorldData = defaultWorlds.find((x) => x.name === action.worldName);
		const newWorldData = defaultWorldData !== undefined ? defaultWorldData : { ...newState[worldDataIndex] };
		newState[worldDataIndex] = newWorldData;

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
