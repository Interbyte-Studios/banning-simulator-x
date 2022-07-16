import Object from "@rbxts/object-utils";
import Rodux from "@rbxts/rodux";
import { t } from "@rbxts/t";
import { WorldName, WORLDS, Worlds } from "shared/configs/worlds";
import { isValidZone, ZoneNames } from "shared/configs/zones";
import { isValidWorld } from "shared/util/isValidWorld";

export type QuestsState = { [P in keyof Worlds]: { zone: { [P in ZoneNames]?: Set<string> }; world: Set<string> } };
export type QuestsAction = RedeemQuest;

interface WorldQuest {
	world: WorldName;
}

const isZoneQuest = t.strictInterface({
	world: isValidWorld,
	zone: isValidZone,
});
type ZoneQuest = t.static<typeof isZoneQuest>;

type QuestType = WorldQuest | ZoneQuest;

export interface RedeemQuest extends Rodux.Action<"redeemQuest"> {
	questType: QuestType;
	name: string;
}

/**
 * @param world The name of the world to redeem the quest for.
 * @param zone The name of the zone to redeem the quest for.
 * @param quest The name of the quest to redeem.
 * @returns The Rodux action to dispatch.
 */
export function redeemZoneQuest(world: WorldName, zone: ZoneNames, quest: string): RedeemQuest & Rodux.AnyAction {
	return {
		type: "redeemQuest",
		questType: {
			world,
			zone,
		},
		name: quest,
	};
}

/**
 * @param world The name of the world to redeem the quest for.
 * @param quest The name of the quest to redeem.
 * @returns The Rodux action to dispatch.
 */
export function redeemWorldQuest(world: WorldName, quest: string): RedeemQuest & Rodux.AnyAction {
	return {
		type: "redeemQuest",
		questType: {
			world,
		},
		name: quest,
	};
}

const defaultState: QuestsState = Object.fromEntries(
	Object.entries(WORLDS).map(
		([name]) =>
			[
				name,
				{
					zone: {},
					world: new Set<string>(),
				},
			] as const,
	),
);

/* eslint-disable jsdoc/require-jsdoc */
export const questsReducer = Rodux.createReducer<QuestsState, QuestsAction>(defaultState, {
	redeemQuest: (state, action) => {
		if (isZoneQuest(action.questType)) {
			return {
				...state,
				[action.questType.world]: {
					...state[action.questType.world],
					zone: {
						...state[action.questType.world].zone,
						[action.questType.zone]: new Set([
							...(state[action.questType.world].zone[action.questType.zone] ?? new Set()),
							action.name,
						]),
					},
				},
			};
		}

		return {
			...state,
			[action.questType.world]: {
				...state[action.questType.world],
				world: new Set([...state[action.questType.world].world, action.name]),
			},
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
