import { t } from "@rbxts/t";

import { Currency } from "./currencies";

export const isRankName = t.literal(
	"Bronze",
	"Silver",
	"Gold",
	"Diamond",
	"Emerald",
	"Draconic",
	"Pendulum",
	"Infinitium",
	"Phoenix",
	"Celestial",
);
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

export const MAX_RANK = 10;
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
		requiredExperience: 3_500,
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
		requiredExperience: 21_000,
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
		requiredExperience: 40_000,
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
		requiredExperience: 164_000,
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
		requiredExperience: 875_000,
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
		requiredExperience: 3_600_000, // 600 the mines normal npcs
	},
	{
		name: "Infinitium",
		id: 8,
		cost: {
			amount: 8_192_000,
			currency: "coins",
		},
		gradient: {
			beginningColor: Color3.fromRGB(133, 5, 217),
			endingColor: Color3.fromRGB(186, 46, 250),
		},
		requiredExperience: 6_500_000, // 650 lava lands npcs
	},
	{
		name: "Phoenix",
		id: 9,
		cost: {
			amount: 16_384_000,
			currency: "coins",
		},
		gradient: {
			beginningColor: Color3.fromRGB(212, 61, 15),
			endingColor: Color3.fromRGB(247, 191, 112),
		},
		requiredExperience: 18_000_000, // 900 enchanted forest npcs
	},
	{
		name: "Celestial",
		id: 10,
		cost: {
			amount: 32_768_000,
			currency: "coins",
		},
		gradient: {
			beginningColor: Color3.fromRGB(224, 120, 255),
			endingColor: Color3.fromRGB(64, 181, 255),
		},
		requiredExperience: 40_000_000, // 1000 toxic land npcs
	},
];
