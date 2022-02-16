import type { Zone } from "..";
import { BAN_LAND_NPCS } from "./npcs";

export const BAN_LAND_ZONES: Array<Zone> = [
	{
		// zone 1
		name: "Forest",
		npcs: [BAN_LAND_NPCS.bronzePiece, BAN_LAND_NPCS.russoTalks],
	},
	{
		// zone 2
		name: "Desert",
		npcs: [BAN_LAND_NPCS.nyxun, BAN_LAND_NPCS.sonsofFun_YT],
		cost: {
			currency: "gold",
			amount: 10_000,
		},
	},
	{
		// zone 3
		name: "Sunflower Field",
		npcs: [BAN_LAND_NPCS.onett, BAN_LAND_NPCS.carbonMeister],
		cost: {
			currency: "gold",
			amount: 40_000,
		},
	},
	{
		// zone 4
		name: "Sakura",
		npcs: [BAN_LAND_NPCS.rellhub, BAN_LAND_NPCS.sabrinaBrite],
		cost: {
			currency: "gold",
			amount: 200_000,
		},
	},
	{
		// zone 5
		name: "Atlantis",
		npcs: [BAN_LAND_NPCS.buildIntoGames, BAN_LAND_NPCS.djMonopoli],
		cost: {
			currency: "gold",
			amount: 1_000_000,
		},
	},
	{
		// zone 6
		name: "Circus",
		npcs: [BAN_LAND_NPCS.foreverDev, BAN_LAND_NPCS.merely],
		cost: {
			currency: "gold",
			amount: 5_000_000,
		},
	},
	{
		// zone 7
		name: "Food Land",
		npcs: [BAN_LAND_NPCS.snickTrix, BAN_LAND_NPCS.alvin_Blox],
		cost: {
			currency: "gold",
			amount: 30_000_000,
		},
	},
	{
		// zone 8
		name: "Lavalands",
		npcs: [BAN_LAND_NPCS.mygame43, BAN_LAND_NPCS.deeterPlays],
		cost: {
			currency: "gold",
			amount: 180_000_000,
		},
	},
	{
		// zone 9
		name: "Haunted Forest",
		npcs: [BAN_LAND_NPCS.gamesReborn, BAN_LAND_NPCS.beeism],
		cost: {
			currency: "gold",
			amount: 1_000_000_000,
		},
	},
];
