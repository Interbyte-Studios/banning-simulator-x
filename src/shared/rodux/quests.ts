import Object from "@rbxts/object-utils";
import Rodux from "@rbxts/rodux";
import { t } from "@rbxts/t";
import { QuestReward } from "shared/configs/quests";
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
	experience: number;
	rewardType: QuestReward;
	name: string;
}

/**
 * @param world The name of the world to redeem the quest for.
 * @param zone The name of the zone to redeem the quest for.
 * @param quest The name of the quest to redeem.
 * @param experience The amount of experience to reward the user with.
 * @param reward The reward to give the user.
 * @returns The Rodux action to dispatch.
 */
export function redeemZoneQuest(
	world: WorldName,
	zone: ZoneNames,
	quest: string,
	experience: number,
	reward: QuestReward,
): RedeemQuest & Rodux.AnyAction {
	return {
		type: "redeemQuest",
		questType: {
			world,
			zone,
		},
		name: quest,
		experience,
		rewardType: reward,
	};
}

/**
 * @param world The name of the world to redeem the quest for.
 * @param quest The name of the quest to redeem.
 * @param experience The amount of experience to reward the user with.
 * @param reward The reward to give the user.
 * @returns The Rodux action to dispatch.
 */
export function redeemWorldQuest(
	world: WorldName,
	quest: string,
	experience: number,
	reward: QuestReward,
): RedeemQuest & Rodux.AnyAction {
	return {
		type: "redeemQuest",
		questType: {
			world,
		},
		name: quest,
		experience,
		rewardType: reward,
	};
}

export const defaultQuestsState: QuestsState = Object.fromEntries(
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
export const questsReducer = Rodux.createReducer<QuestsState, QuestsAction>(defaultQuestsState, {
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
