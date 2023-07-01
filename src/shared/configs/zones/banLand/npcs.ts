import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

import { Npc } from "..";

export const BAN_LAND_NPCS = preserveWithConstraint<Record<string, Npc>>()({
	bronzePiece: {
		name: "Forest Wizard",
		health: 100,
		reward: {
			bans: 1,
			currency: 35,
			currencyType: "coins",
			experience: 10,
		},
		rank: 1,
		isBoss: false,
	},
	nyxun: {
		name: "Desert Bandit",
		health: 200,
		reward: {
			bans: 2,
			currency: 60,
			currencyType: "coins",
			experience: 20,
		},
		rank: 1,
		isBoss: false,
	},
	rellhub: identity<Npc>({
		name: "Floral Girl",
		health: 400,
		reward: {
			bans: 4,
			currency: 120,
			currencyType: "coins",
			experience: 40,
		},
		rank: 1,
		isBoss: false,
	}),
	onett: identity<Npc>({
		name: "Bee King",
		health: 800,
		reward: {
			bans: 8,
			currency: 270,
			currencyType: "coins",
			experience: 80,
		},
		rank: 2,
		isBoss: false,
	}),
	buildIntoGames: identity<Npc>({
		name: "Ice Skier",
		health: 1_600,
		reward: {
			bans: 16,
			currency: 810,
			currencyType: "coins",
			experience: 200,
		},
		rank: 3,
		isBoss: false,
	}),
	foreverDev: identity<Npc>({
		name: "Beach Boy",
		health: 3_200,
		reward: {
			bans: 32,
			currency: 1_215,
			currencyType: "coins",
			experience: 800,
		},
		rank: 4,
		isBoss: false,
	}),
	snickTrix: identity<Npc>({
		name: "Sparkletime King",
		health: 6_400,
		reward: {
			bans: 64,
			currency: 2_100,
			currencyType: "coins",
			experience: 2_000,
		},
		rank: 5,
		isBoss: false,
	}),
	mygame43: identity<Npc>({
		name: "Mining Guy",
		health: 12_800,
		reward: {
			bans: 128,
			currency: 4_200,
			currencyType: "coins",
			experience: 6_000,
		},
		rank: 6,
		isBoss: false,
	}),
	gamesReborn: identity<Npc>({
		name: "Lava Lord",
		health: 25_600,
		reward: {
			bans: 256,
			currency: 8_400,
			currencyType: "coins",
			experience: 10_000,
		},
		rank: 7,
		isBoss: false,
	}),

	// Bosses
	russoTalks: identity<Npc>({
		name: "Mushroom King",
		health: 300,
		reward: {
			bans: 3,
			currency: 105,
			currencyType: "coins",
			experience: 120,
		},
		rank: 1,
		isBoss: true,
	}),
	sonsofFun_YT: identity<Npc>({
		name: "Desert Scout",
		health: 600,
		reward: {
			bans: 6,
			currency: 180,
			currencyType: "coins",
			experience: 240,
		},
		rank: 1,
		isBoss: true,
	}),
	carbonMeister: identity<Npc>({
		name: "Magic Floral Man",
		health: 1_200,
		reward: {
			bans: 12,
			currency: 360,
			currencyType: "coins",
			experience: 480,
		},
		rank: 1,
		isBoss: true,
	}),
	sabrinaBrite: identity<Npc>({
		name: "Onett",
		health: 2_400,
		reward: {
			bans: 24,
			currency: 810,
			currencyType: "coins",
			experience: 945,
		},
		rank: 2,
		isBoss: true,
	}),
	djMonopoli: identity<Npc>({
		name: "Ice Golem",
		health: 4_800,
		reward: {
			bans: 48,
			currency: 2_430,
			currencyType: "coins",
			experience: 1_875,
		},
		rank: 3,
		isBoss: true,
	}),
	merely: identity<Npc>({
		name: "Pufferfish King",
		health: 9_600,
		reward: {
			bans: 96,
			currency: 3_645,
			currencyType: "coins",
			experience: 3_750,
		},
		rank: 4,
		isBoss: true,
	}),
	alvin_Blox: identity<Npc>({
		name: "Pastel Guardian",
		health: 19_200,
		reward: {
			bans: 192,
			currency: 6_300,
			currencyType: "coins",
			experience: 7_500,
		},
		rank: 5,
		isBoss: true,
	}),
	deeterPlays: identity<Npc>({
		name: "Elemental King",
		health: 38_400,
		reward: {
			bans: 384,
			currency: 12_600,
			currencyType: "coins",
			experience: 15_000,
		},
		rank: 6,
		isBoss: true,
	}),
	beeism: identity<Npc>({
		name: "Headless Doombringer",
		health: 76_800,
		reward: {
			bans: 768,
			currency: 25_200,
			currencyType: "coins",
			experience: 30_000,
		},
		rank: 7,
		isBoss: true,
	}),
});
