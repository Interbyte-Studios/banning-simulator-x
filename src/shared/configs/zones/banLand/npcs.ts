import { preserveWithConstraint } from "shared/util/preserveWithConstraint";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { Npc } from "..";

/**
 * Abbreviates a number.
 *
 * @param x The item to shorten.
 * @returns The abbreviated number, to two decimal places.
 */
function shorten(x: string): number {
	return twoDpAbbreviator.stringToNumber(x);
}

export const BAN_LAND_NPCS = preserveWithConstraint<Record<string, Npc>>()({
	bronzePiece: {
		name: "BronzePiece",
		health: 50,
		userId: 1966189720,
		reward: {
			currency: 250,
			experience: 5,
		},
		rank: "Bronze",
		isBoss: false,
	},
	nyxun: {
		name: "Nyxun",
		health: 200,
		userId: 34170410,
		reward: {
			currency: 750,
			experience: 15,
		},
		rank: "Bronze",
		isBoss: false,
	},
	onett: identity<Npc>({
		name: "Onett",
		health: 800,
		userId: 1912490,
		reward: {
			currency: shorten("3k"),
			experience: 25,
		},
		rank: "Bronze",
		isBoss: false,
	}),
	rellhub: identity<Npc>({
		name: "RELLhub",
		health: shorten("3.2k"),
		userId: 18663014,
		reward: {
			currency: shorten("12.5k"),
			experience: 60,
		},
		rank: "Bronze",
		isBoss: false,
	}),
	buildIntoGames: identity<Npc>({
		name: "BuildIntoGames",
		health: shorten("12.8k"),
		userId: 19717956,
		reward: {
			currency: shorten("50k"),
			experience: 250,
		},
		rank: "Silver",
		isBoss: false,
	}),
	foreverDev: identity<Npc>({
		name: "ForeverDev",
		health: shorten("51.2k"),
		userId: 1210210,
		reward: {
			currency: shorten("250k"),
			experience: shorten("1.75k"),
		},
		rank: "Silver",
		isBoss: false,
	}),
	snickTrix: identity<Npc>({
		name: "SnickTrix",
		health: shorten("204.8k"),
		userId: 22641473,
		reward: {
			currency: shorten("1.25M"),
			experience: shorten("8.25k"),
		},
		rank: "Silver",
		isBoss: false,
	}),
	mygame43: identity<Npc>({
		name: "mygame43",
		health: shorten("819.2k"),
		userId: 912348,
		reward: {
			currency: shorten("7M"),
			experience: shorten("49k"),
		},
		rank: "Silver",
		isBoss: false,
	}),
	gamesReborn: identity<Npc>({
		name: "GamesReborn",
		health: shorten("3.277M"),
		userId: 20532808,
		reward: {
			currency: shorten("35M"),
			experience: shorten("250k"),
		},
		rank: "Gold",
		isBoss: false,
	}),

	russoTalks: identity<Npc>({
		name: "RussoTalks",
		health: 150,
		userId: 164279327,
		reward: {
			currency: 500,
			experience: 10,
		},
		rank: "Bronze",
		isBoss: true,
	}),
	sonsofFun_YT: identity<Npc>({
		name: "SonsofFun_YT",
		health: 600,
		userId: 401989564,
		reward: {
			currency: shorten("1.5k"),
			experience: 30,
		},
		rank: "Bronze",
		isBoss: true,
	}),
	carbonMeister: identity<Npc>({
		name: "CarbonMeister",
		health: shorten("2.4k"),
		userId: 487532097,
		reward: {
			currency: shorten("6k"),
			experience: 50,
		},
		rank: "Bronze",
		isBoss: true,
	}),
	sabrinaBrite: identity<Npc>({
		name: "SabrinaBrite",
		health: shorten("9.6k"),
		userId: 138235305,
		reward: {
			currency: shorten("25k"),
			experience: 120,
		},
		rank: "Bronze",
		isBoss: true,
	}),
	djMonopoli: identity<Npc>({
		name: "DJMonopoli",
		health: shorten("38.4k"),
		userId: 180057364,
		reward: {
			currency: shorten("100k"),
			experience: 500,
		},
		rank: "Silver",
		isBoss: true,
	}),
	merely: identity<Npc>({
		name: "Merely",
		health: shorten("153.6k"),
		userId: 13416513,
		reward: {
			currency: shorten("500k"),
			experience: shorten("3.5k"),
		},
		rank: "Silver",
		isBoss: true,
	}),
	alvin_Blox: identity<Npc>({
		name: "Alvin_Blox",
		health: shorten("614.4k"),
		userId: 14943069,
		reward: {
			currency: shorten("2.5M"),
			experience: shorten("16.5k"),
		},
		rank: "Silver",
		isBoss: true,
	}),
	deeterPlays: identity<Npc>({
		name: "DeeterPlays",
		health: shorten("2.458M"),
		userId: 178236960,
		reward: {
			currency: shorten("14M"),
			experience: shorten("98k"),
		},
		rank: "Silver",
		isBoss: true,
	}),
	beeism: identity<Npc>({
		name: "Beeism",
		health: shorten("9.83M"),
		userId: 59943819,
		reward: {
			currency: shorten("70M"),
			experience: shorten("500k"),
		},
		rank: "Gold",
		isBoss: true,
	}),
});
