import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

import { Npc } from "..";

export const BAN_LAND_NPCS = preserveWithConstraint<Record<string, Npc>>()({
	bronzePiece: {
		name: "BronzePiece",
		health: 100,
		reward: {
			currency: 20,
			currencyType: "coins",
			experience: 10,
		},
		rank: 1,
		isBoss: false,
	},
	nyxun: {
		name: "Nyxun",
		health: 200,
		reward: {
			currency: 40,
			currencyType: "coins",
			experience: 20,
		},
		rank: 1,
		isBoss: false,
	},
	rellhub: identity<Npc>({
		name: "RELLhub",
		health: 400,
		reward: {
			currency: 80,
			currencyType: "coins",
			experience: 40,
		},
		rank: 1,
		isBoss: false,
	}),
	onett: identity<Npc>({
		name: "Onett",
		health: 800,
		reward: {
			currency: 160,
			currencyType: "coins",
			experience: 80,
		},
		rank: 2,
		isBoss: false,
	}),
	buildIntoGames: identity<Npc>({
		name: "BuildIntoGames",
		health: 1_600,
		reward: {
			currency: 640,
			currencyType: "coins",
			experience: 200,
		},
		rank: 3,
		isBoss: false,
	}),
	foreverDev: identity<Npc>({
		name: "ForeverDev",
		health: 3_200,
		reward: {
			currency: 640,
			currencyType: "coins",
			experience: 800,
		},
		rank: 4,
		isBoss: false,
	}),
	snickTrix: identity<Npc>({
		name: "SnickTrix",
		health: 6_400,
		reward: {
			currency: 1_280,
			currencyType: "coins",
			experience: 2_000,
		},
		rank: 5,
		isBoss: false,
	}),
	mygame43: identity<Npc>({
		name: "mygame43",
		health: 12_800,
		reward: {
			currency: 2_560,
			currencyType: "coins",
			experience: 6_000,
		},
		rank: 6,
		isBoss: false,
	}),
	gamesReborn: identity<Npc>({
		name: "GamesReborn",
		health: 25_600,
		reward: {
			currency: 5_120,
			currencyType: "coins",
			experience: 10_000,
		},
		rank: 7,
		isBoss: false,
	}),

	// Bosses
	russoTalks: identity<Npc>({
		name: "RussoTalks",
		health: 300,
		reward: {
			currency: 60,
			currencyType: "coins",
			experience: 120,
		},
		rank: 1,
		isBoss: true,
	}),
	sonsofFun_YT: identity<Npc>({
		name: "SonsofFun_YT",
		health: 600,
		reward: {
			currency: 120,
			currencyType: "coins",
			experience: 240,
		},
		rank: 1,
		isBoss: true,
	}),
	carbonMeister: identity<Npc>({
		name: "CarbonMeister",
		health: 1_200,
		reward: {
			currency: 240,
			currencyType: "coins",
			experience: 480,
		},
		rank: 1,
		isBoss: true,
	}),
	sabrinaBrite: identity<Npc>({
		name: "SabrinaBrite",
		health: 2_400,
		reward: {
			currency: 480,
			currencyType: "coins",
			experience: 945,
		},
		rank: 2,
		isBoss: true,
	}),
	djMonopoli: identity<Npc>({
		name: "DJMonopoli",
		health: 4_800,
		reward: {
			currency: 960,
			currencyType: "coins",
			experience: 1_875,
		},
		rank: 3,
		isBoss: true,
	}),
	merely: identity<Npc>({
		name: "Merely",
		health: 9_600,
		reward: {
			currency: 1_920,
			currencyType: "coins",
			experience: 3_750,
		},
		rank: 4,
		isBoss: true,
	}),
	alvin_Blox: identity<Npc>({
		name: "Alvin_Blox",
		health: 19_200,
		reward: {
			currency: 3_840,
			currencyType: "coins",
			experience: 7_500,
		},
		rank: 5,
		isBoss: true,
	}),
	deeterPlays: identity<Npc>({
		name: "DeeterPlays",
		health: 38_400,
		reward: {
			currency: 7_680,
			currencyType: "coins",
			experience: 15_000,
		},
		rank: 6,
		isBoss: true,
	}),
	beeism: identity<Npc>({
		name: "Beeism",
		health: 76_800,
		reward: {
			currency: 15_360,
			currencyType: "coins",
			experience: 30_000,
		},
		rank: 7,
		isBoss: true,
	}),
});
