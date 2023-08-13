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
	"Cyber Initiate",
	"Cyber Neophyte",
	"Cyber Elite",
	"Cyber Champion",
	"Cyber Paragon",
	"Cyber Exarch",
	"Cyber Warrior",
	"Cyber Ascendant",
	"Cyber Immortal",
	"Cyber Mythic",
	"Cyber Legend",
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

export const MAX_RANK = 18;
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
	{
		name: "Cyber Initiate",
		id: 11,
		cost: {
			amount: 65_536_000,
			currency: "coins",
		},
		gradient: {
			beginningColor: Color3.fromRGB(196, 247, 166),
			endingColor: Color3.fromRGB(64, 181, 255),
		},
		requiredExperience: 80_000_000, // 1000 jester npcs
	},
	{
		name: "Cyber Neophyte",
		id: 12,
		cost: {
			amount: 30_000,
			currency: "cyber tokens",
		},
		gradient: {
			beginningColor: Color3.fromRGB(28, 28, 28),
			endingColor: Color3.fromRGB(247, 120, 115),
		},
		requiredExperience: 160_000_000, // 1000 neon city npcs
	},
	{
		name: "Cyber Elite",
		id: 13,
		cost: {
			amount: 90_000,
			currency: "cyber tokens",
		},
		gradient: {
			beginningColor: Color3.fromRGB(166, 31, 217),
			endingColor: Color3.fromRGB(252, 250, 107),
		},
		requiredExperience: 320_000_000, // 1000 electric center npcs
	},
	{
		name: "Cyber Champion",
		id: 14,
		cost: {
			amount: 270_000,
			currency: "cyber tokens",
		},
		gradient: {
			beginningColor: Color3.fromRGB(166, 31, 217),
			endingColor: Color3.fromRGB(252, 250, 107),
		},
		requiredExperience: 640_000_000, // 1000 neon district npcs
	},
	{
		name: "Cyber Paragon",
		id: 15,
		cost: {
			amount: 810_000,
			currency: "cyber tokens",
		},
		gradient: {
			beginningColor: Color3.fromRGB(66, 117, 255),
			endingColor: Color3.fromRGB(247, 247, 247),
		},
		requiredExperience: 1_280_000_000, // 1000 malware mayhem npcs
	},
	{
		name: "Cyber Exarch",
		id: 16,
		cost: {
			amount: 2_430_000,
			currency: "cyber tokens",
		},
		gradient: {
			beginningColor: Color3.fromRGB(255, 71, 66),
			endingColor: Color3.fromRGB(138, 240, 143),
		},
		requiredExperience: 2_560_000_000, // 1000 ufo valley npcs
	},
	{
		name: "Cyber Warrior",
		id: 17,
		cost: {
			amount: 7_290_000,
			currency: "cyber tokens",
		},
		gradient: {
			beginningColor: Color3.fromRGB(179, 66, 255),
			endingColor: Color3.fromRGB(245, 245, 245),
		},
		requiredExperience: 5_120_000_000, // 1000 holographic museum npcs
	},
	{
		name: "Cyber Ascendant",
		id: 18,
		cost: {
			amount: 21_870_000,
			currency: "cyber tokens",
		},
		gradient: {
			beginningColor: Color3.fromRGB(163, 66, 255),
			endingColor: Color3.fromRGB(232, 240, 138),
		},
		requiredExperience: 10_240_000_000, // 1000 B1n4ry Z0n3 npcs
	},
	{
		name: "Cyber Immortal",
		id: 19,
		cost: {
			amount: 65_610_000,
			currency: "cyber tokens",
		},
		gradient: {
			beginningColor: Color3.fromRGB(163, 66, 255),
			endingColor: Color3.fromRGB(18, 18, 18),
		},
		requiredExperience: 20_480_000_000, // 1000 B1n4ry Z0n3 npcs
	},
	{
		name: "Cyber Mythic",
		id: 20,
		cost: {
			amount: 196_830_000,
			currency: "cyber tokens",
		},
		gradient: {
			beginningColor: Color3.fromRGB(163, 66, 255),
			endingColor: Color3.fromRGB(48, 217, 237),
		},
		requiredExperience: 40_960_000_000, // 1000 B1n4ry Z0n3 npcs
	},
	{
		name: "Cyber Legend",
		id: 21,
		cost: {
			amount: 590_490_000,
			currency: "cyber tokens",
		},
		gradient: {
			beginningColor: Color3.fromRGB(255, 94, 94),
			endingColor: Color3.fromRGB(224, 242, 18),
		},
		requiredExperience: 81_920_000_000, // 1000 B1n4ry Z0n3 npcs
	},
];
