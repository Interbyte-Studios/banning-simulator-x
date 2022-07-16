import { StoreState } from "shared/rodux";

import { Currency } from "../currencies";
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
}

interface TitleReward {
	kind: "title";
}

interface Quest {
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
	specialReward: CurrencyReward | PetReward | TitleReward;
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
	[P in keyof Worlds]: { zone: { [P in ZoneNames]?: Array<Quest> }; world: Array<Quest> };
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
						currency: "gold",
					},
				},
			],
		},
		world: [
			{
				name: "Kill 30 mobs",
				validate: () => ({ progress: 10, completionProgress: 20 }),
				experienceReward: 50,
				specialReward: {
					kind: "title",
				},
			},
		],
	},
};
/* eslint-enable jsdoc/require-jsdoc */
