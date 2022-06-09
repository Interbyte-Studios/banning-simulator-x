import Rodux from "@rbxts/rodux";
import { Currency } from "shared/configs/currencies";
import { WorldNames, WORLDS } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";

interface Zone {
	isOwned: boolean;
	name: ZoneNames;
}

interface World {
	isOwned: boolean;
	name: WorldNames;
	zones: Array<Zone>;
}

export type WorldsState = Array<World>;
export type WorldActions = UnlockWorld | UnlockZone;

export interface UnlockWorld extends Rodux.Action<"unlockWorld"> {
	currency: number;
	currencyType: Currency;
	worldName: WorldNames;
}

export interface UnlockZone extends Rodux.Action<"unlockZone"> {
	currency: number;
	currencyType: Currency;
	worldName: WorldNames;
	zoneName: ZoneNames;
}

const defaultWorlds: Array<World> = [
	{
		isOwned: true,
		name: "Ban Land",
		zones: [
			{
				isOwned: true,
				name: "Forest",
			},
		],
	},
];

/* eslint-disable jsdoc/require-jsdoc */
export const worldsReducer = Rodux.createReducer<WorldsState, WorldActions>(defaultWorlds, {
	unlockWorld: (state, action) => {
		const worldData = WORLDS[action.worldName];
		let firstZone: ZoneNames | undefined;

		for (const [zoneName, zoneData] of pairs(worldData.zones)) {
			if (zoneData.id !== 1) continue;

			firstZone = zoneName;
		}
		assert(firstZone, `Expected to find first zone of world ${action.worldName}`);

		const newWorldData: World = {
			isOwned: true,
			name: action.worldName,
			zones: [
				{
					isOwned: true,
					name: firstZone,
				},
			],
		};

		const newState: Array<World> = [...state];
		newState.push(newWorldData);

		return newState;
	},
	unlockZone: (state, action) => {
		const newState: Array<World> = [...state];

		const worldData = newState.find((x) => x.name === action.worldName);
		assert(worldData, `Expected to find world data for ${action.worldName} when unlocking zone ${action.zoneName}`);

		const newZoneData: Zone = {
			isOwned: true,
			name: action.zoneName,
		};

		worldData.zones.push(newZoneData);
		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
