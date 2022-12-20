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
		reward: {
			currency: 250,
			experience: 7.5,
		},
		rank: 1,
		isBoss: false,
	},
	nyxun: {
		name: "Nyxun",
		health: 200,
		reward: {
			currency: 750,
			experience: 26,
		},
		rank: 1,
		isBoss: false,
	},
	onett: identity<Npc>({
		name: "Onett",
		health: 800,
		reward: {
			currency: shorten("3k"),
			experience: 45,
		},
		rank: 2,
		isBoss: false,
	}),
	rellhub: identity<Npc>({
		name: "RELLhub",
		health: shorten("3.2k"),
		reward: {
			currency: shorten("12.5k"),
			experience: 83,
		},
		rank: 2,
		isBoss: false,
	}),
	buildIntoGames: identity<Npc>({
		name: "BuildIntoGames",
		health: shorten("12.8k"),
		reward: {
			currency: shorten("50k"),
			experience: 136,
		},
		rank: 3,
		isBoss: false,
	}),
	foreverDev: identity<Npc>({
		name: "ForeverDev",
		health: shorten("51.2k"),
		reward: {
			currency: shorten("250k"),
			experience: shorten("1.1k"),
		},
		rank: 3,
		isBoss: false,
	}),
	snickTrix: identity<Npc>({
		name: "SnickTrix",
		health: shorten("204.8k"),
		reward: {
			currency: shorten("1.25M"),
			experience: shorten("3.7k"),
		},
		rank: 4,
		isBoss: false,
	}),
	mygame43: identity<Npc>({
		name: "mygame43",
		health: shorten("819.2k"),
		reward: {
			currency: shorten("7M"),
			experience: shorten("14k"),
		},
		rank: 4,
		isBoss: false,
	}),
	gamesReborn: identity<Npc>({
		name: "GamesReborn",
		health: shorten("3.277M"),
		reward: {
			currency: shorten("35M"),
			experience: shorten("30k"),
		},
		rank: 5,
		isBoss: false,
	}),

	russoTalks: identity<Npc>({
		name: "RussoTalks",
		health: 150,
		reward: {
			currency: 500,
			experience: 50,
		},
		rank: 1,
		isBoss: true,
	}),
	sonsofFun_YT: identity<Npc>({
		name: "SonsofFun_YT",
		health: 600,
		reward: {
			currency: shorten("1.5k"),
			experience: 175,
		},
		rank: 1,
		isBoss: true,
	}),
	carbonMeister: identity<Npc>({
		name: "CarbonMeister",
		health: shorten("2.4k"),
		reward: {
			currency: shorten("6k"),
			experience: 300,
		},
		rank: 2,
		isBoss: true,
	}),
	sabrinaBrite: identity<Npc>({
		name: "SabrinaBrite",
		health: shorten("9.6k"),
		reward: {
			currency: shorten("25k"),
			experience: 550,
		},
		rank: 2,
		isBoss: true,
	}),
	djMonopoli: identity<Npc>({
		name: "DJMonopoli",
		health: shorten("38.4k"),
		reward: {
			currency: shorten("100k"),
			experience: 900,
		},
		rank: 3,
		isBoss: true,
	}),
	merely: identity<Npc>({
		name: "Merely",
		health: shorten("153.6k"),
		reward: {
			currency: shorten("500k"),
			experience: shorten("7.5k"),
		},
		rank: 3,
		isBoss: true,
	}),
	alvin_Blox: identity<Npc>({
		name: "Alvin_Blox",
		health: shorten("614.4k"),
		reward: {
			currency: shorten("2.5M"),
			experience: shorten("25k"),
		},
		rank: 4,
		isBoss: true,
	}),
	deeterPlays: identity<Npc>({
		name: "DeeterPlays",
		health: shorten("2.458M"),
		reward: {
			currency: shorten("14M"),
			experience: shorten("95k"),
		},
		rank: 4,
		isBoss: true,
	}),
	beeism: identity<Npc>({
		name: "Beeism",
		health: shorten("9.83M"),
		reward: {
			currency: shorten("70M"),
			experience: shorten("200k"),
		},
		rank: 5,
		isBoss: true,
	}),
});
