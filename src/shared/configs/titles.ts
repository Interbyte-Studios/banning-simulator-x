import { StoreState } from "shared/rodux";
import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

interface Title {
	name: string;
	effect: Color3 | ColorSequence;
	condition: (state: StoreState) => boolean;
}

/* eslint-disable jsdoc/require-jsdoc */
export const TITLES = preserveWithConstraint<ReadonlyArray<Title>>()([
	{
		name: "500 exp",
		effect: Color3.fromRGB(50, 50, 50),
		condition: (state): boolean => state.experience >= 500,
	},
	{
		name: "free title!",
		effect: Color3.fromRGB(75, 75, 75),
		condition: (): boolean => true,
	},
] as const);
/* eslint-enable jsdoc/require-jsdoc */
export type PossibleTitle = typeof TITLES[number]["name"];

/**
 * Checks if a given title is a valid title name.
 *
 * @param x The name of the title to validate.
 * @returns If the passed object was a valid tile.
 */
export function isValidTitle(x: unknown): x is PossibleTitle {
	const data = TITLES.find((title) => title.name === x);
	return data !== undefined;
}
