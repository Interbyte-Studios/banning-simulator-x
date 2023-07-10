import { StoreState } from "shared/rodux";

import { Currency } from "../currencies";
import { Variants } from "../pets";
import { Worlds } from "../worlds";
import { ZoneNames } from "../zones";

interface CurrencyReward {
	kind: "currency";
	amount: number;
	currency: Currency;
}

interface PetReward {
	kind: "pet";
	id: number;
	guid: string;
	variant: Variants;
}

interface TitleReward {
	kind: "title";
}

export type QuestReward = CurrencyReward | PetReward | TitleReward;

export interface Quest {
	/**
	 * The name of the quest to display to the user.
	 */
	name: string;
	/**
	 * A validator function that determines if the user has completed the quest.
	 */
	validate: (state: StoreState) => { progress: number; completionProgress: number };
	/**
	 * The reward to give to the player once they have completed the quest.
	 */
	specialReward: QuestReward;
	/**
	 * The amount of experience to reward.
	 */
	experienceReward: number;
}

/**
 * The quests configuration.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const QUESTS: {
	[P in keyof Worlds]: { zone: { [P in ZoneNames]: Array<Quest> }; world: Array<Quest> };
} = {
	"Ban Land": {
		zone: {
			Desert: [
				{
					name: "Kill 15 mobs",
					validate: () => ({ progress: 5, completionProgress: 15 }),
					experienceReward: 20,
					specialReward: {
						kind: "currency",
						amount: 5_000,
						currency: "coins",
					},
				},
			],
			"Candy Land": [],
			"Ice Land": [],
			"Lava Lands": [],
			"Sunflower Field": [],
			"The Mines": [],
			Beach: [],
			Forest: [],
			Honeycomb: [],
			"Enchanted Forest": [],
			"Toxic Lands": [],
			"Jester Castle": [],
		},
		world: [
			{
				name: "Kill 30 mobs",
				validate: () => ({ progress: 20, completionProgress: 20 }),
				experienceReward: 50,
				specialReward: {
					kind: "title",
				},
			},
		],
	},
};
/* eslint-enable jsdoc/require-jsdoc */

// runtime-check against duplicate quest names
const questNames = new Set();
for (const [, world] of pairs(QUESTS)) {
	for (const quest of world.world) {
		assert(!questNames.has(quest.name), `Quest ${quest.name} was a duplicate quest`);
		questNames.add(quest.name);
	}

	for (const [, zone] of pairs(world.zone)) {
		for (const quest of zone) {
			assert(!questNames.has(quest.name), `Quest ${quest.name} was a duplicate quest`);
			questNames.add(quest.name);
		}
	}
}

/**
 * Returns if the value is a valid quest.
 *
 * @param x The value to check.
 * @returns If the given object was a valid quest name.
 */
export function isValidQuest(x: unknown): x is string {
	return questNames.has(x);
}
