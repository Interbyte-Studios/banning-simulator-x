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
		effect: new Color3(50, 50, 50),
		condition: (state): boolean => state.experience >= 500,
	},
	{
		name: "free title!",
		effect: new Color3(75, 75, 75),
		condition: (): boolean => true,
	},
] as const);
/* eslint-enable jsdoc/require-jsdoc */
