/// <reference types="@rbxts/testez/globals" />

import { currenciesReducer } from "../currencies";
import { experienceReducer } from "../experience";
import { petsReducer, PetsState } from "../pets";
import { questsReducer, redeemWorldQuest, redeemZoneQuest } from "../quests";
import { testAction } from "./testAction";

export = (): void => {
	describe("rodux/quests", () => {
		it("should redeem a zone quest", () => {
			const state = {
				"Ban Land": {
					world: new Set<string>(),
					zone: {},
				},
				"Cyber Cities": {
					world: new Set<string>(),
					zone: {},
				},
			};

			const action = redeemZoneQuest("Ban Land", "Desert", "Kill 15 mobs", 50, {
				kind: "title",
			});

			const newState = {
				"Ban Land": {
					world: new Set<string>(),
					zone: {
						Desert: new Set(["Kill 15 mobs"]),
					},
				},
				"Cyber Cities": {
					world: new Set<string>(),
					zone: {},
				},
			};

			testAction(state, newState, questsReducer, action);
		});

		it("should redeem a world quest", () => {
			const state = {
				"Ban Land": {
					world: new Set<string>(),
					zone: {},
				},
				"Cyber Cities": {
					world: new Set<string>(),
					zone: {},
				},
			};

			const action = redeemWorldQuest("Ban Land", "Kill 30 mobs", 50, {
				kind: "title",
			});

			const newState = {
				"Ban Land": {
					world: new Set(["Kill 30 mobs"]),
					zone: {},
				},
				"Cyber Cities": {
					world: new Set([]),
					zone: {},
				},
			};

			testAction(state, newState, questsReducer, action);
		});

		it("should add experience when redeeming quest", () => {
			const state = 100;

			const action = redeemWorldQuest("Ban Land", "Kill 30 mobs", 50, {
				kind: "title",
			});

			const newState = 150;

			testAction(state, newState, experienceReducer, action);
		});

		it("should add currency when redeeming quest", () => {
			const state = { coins: 100, gems: 10, gears: 10, "cyber tokens": 10 };

			const action = redeemWorldQuest("Ban Land", "Kill 30 mobs", 50, {
				kind: "currency",
				amount: 100,
				currency: "coins",
			});

			const newState = {
				coins: 200,
				gems: 10,
				gears: 10,
				"cyber tokens": 10,
			};

			testAction(state, newState, currenciesReducer, action);
		});

		it("should add pet when redeeming quest", () => {
			const state: PetsState = [];

			const action = redeemWorldQuest("Ban Land", "Kill 30 mobs", 50, {
				kind: "pet",
				guid: "abc123",
				id: 40,
				variant: "regular",
			});

			const newState: PetsState = [
				{
					id: 40,
					guid: "abc123",
					equipped: false,
					locked: false,
					//enhancements: {},
					bans: 0,
					variant: "regular",
					tradeLocked: false,
				},
			];

			testAction(state, newState, petsReducer, action);
		});
	});
};
