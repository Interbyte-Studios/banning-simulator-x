import { StoreState } from "shared/rodux";

interface Title {
	name: string;
	effect: Color3 | ColorSequence;
	condition: (state: StoreState) => boolean;
}

/* eslint-disable jsdoc/require-jsdoc */
export const TITLES: Array<Title> = [
	{
		name: "500 exp",
		effect: new Color3(50, 50, 50),
		condition: (state) => state.experience >= 500,
	},
];
/* eslint-enable jsdoc/require-jsdoc */
