import { StoreState } from "shared/rodux";

import { Worlds } from "../worlds";

interface Quest {
	/**
	 * The name of the quest to display to the user.
	 */
	name: string;
	/**
	 * A validator function that determines if the user has completed the quest.
	 */
	validate: (state: StoreState) => boolean;
}

/**
 * The quests configuration.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const QUESTS: { [P in keyof Worlds]: Array<Quest> } = {
	"Ban Land": [
		{
			name: "Kill 15 mobs",
			validate: () => true,
		},
	],
};
/* eslint-enable jsdoc/require-jsdoc */
