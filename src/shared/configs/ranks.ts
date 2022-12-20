import { t } from "@rbxts/t";

import { Currency } from "./currencies";

export const isRankName = t.literal("Bronze", "Silver", "Gold", "Diamond", "Emerald", "Draconic", "Pendulum");
export type RankName = t.static<typeof isRankName>;

interface Rank {
	name: RankName;
	id: number;

	cost: {
		amount: number;
		currency: Currency;
	};

	gradient: {
		beginningColor: Color3;
		endingColor: Color3;
	};

	requiredExperience: number;
}

export const MAX_RANK = 7;
export const RANKS: Array<Rank> = [
	{
		name: "Bronze",
		id: 1,
		cost: {
			amount: 0,
			currency: "coins",
		},
		gradient: {
			beginningColor: Color3.fromRGB(92, 51, 32),
			endingColor: Color3.fromRGB(161, 108, 78),
		},
		requiredExperience: 0,
	},
	{
		name: "Silver",
		id: 2,
		cost: {
			amount: 30_000,
			currency: "coins",
		},
		gradient: {
			beginningColor: Color3.fromRGB(86, 100, 107),
			endingColor: Color3.fromRGB(151, 161, 167),
		},
		requiredExperience: 7_000,
	},
	{
		name: "Gold",
		id: 3,
		cost: {
			amount: 750_000,
			currency: "coins",
		},
		gradient: {
			beginningColor: Color3.fromRGB(84, 54, 0),
			endingColor: Color3.fromRGB(252, 199, 84),
		},
		requiredExperience: 22_000,
	},
	{
		name: "Diamond",
		id: 4,
		cost: {
			amount: 15_000_000,
			currency: "coins",
		},
		gradient: {
			beginningColor: Color3.fromRGB(0, 46, 69),
			endingColor: Color3.fromRGB(82, 181, 245),
		},
		requiredExperience: 450_000,
	},
	{
		name: "Emerald",
		id: 5,
		cost: {
			amount: 560_000_000,
			currency: "coins",
		},
		gradient: {
			beginningColor: Color3.fromRGB(5, 61, 3),
			endingColor: Color3.fromRGB(120, 235, 107),
		},
		requiredExperience: 5_700_000,
	},
	{
		name: "Draconic",
		id: 6,
		cost: {
			amount: 25_200_000_000,
			currency: "coins",
		},
		gradient: {
			beginningColor: Color3.fromRGB(51, 0, 0),
			endingColor: Color3.fromRGB(135, 51, 43),
		},
		requiredExperience: 10_000_000,
	},
	{
		name: "Pendulum",
		id: 7,
		cost: {
			amount: 1_008_000_000_000,
			currency: "coins",
		},
		gradient: {
			beginningColor: Color3.fromRGB(245, 252, 99),
			endingColor: Color3.fromRGB(64, 181, 255),
		},
		requiredExperience: 2_375_000_000,
	},
];
