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
			amount: 2_000,
			currency: "coins",
		},
		gradient: {
			beginningColor: Color3.fromRGB(86, 100, 107),
			endingColor: Color3.fromRGB(151, 161, 167),
		},
		requiredExperience: 2_000,
	},
	{
		name: "Gold",
		id: 3,
		cost: {
			amount: 8_000,
			currency: "coins",
		},
		gradient: {
			beginningColor: Color3.fromRGB(84, 54, 0),
			endingColor: Color3.fromRGB(252, 199, 84),
		},
		requiredExperience: 4_000,
	},
	{
		name: "Diamond",
		id: 4,
		cost: {
			amount: 32_000,
			currency: "coins",
		},
		gradient: {
			beginningColor: Color3.fromRGB(0, 46, 69),
			endingColor: Color3.fromRGB(82, 181, 245),
		},
		requiredExperience: 16_000,
	},
	{
		name: "Emerald",
		id: 5,
		cost: {
			amount: 128_000,
			currency: "coins",
		},
		gradient: {
			beginningColor: Color3.fromRGB(5, 61, 3),
			endingColor: Color3.fromRGB(120, 235, 107),
		},
		requiredExperience: 93_750,
	},
	{
		name: "Draconic",
		id: 6,
		cost: {
			amount: 512_000,
			currency: "coins",
		},
		gradient: {
			beginningColor: Color3.fromRGB(51, 0, 0),
			endingColor: Color3.fromRGB(135, 51, 43),
		},
		requiredExperience: 500_000,
	},
	{
		name: "Pendulum",
		id: 7,
		cost: {
			amount: 2_048_000,
			currency: "coins",
		},
		gradient: {
			beginningColor: Color3.fromRGB(245, 252, 99),
			endingColor: Color3.fromRGB(64, 181, 255),
		},
		requiredExperience: 5_000_000,
	},
];
