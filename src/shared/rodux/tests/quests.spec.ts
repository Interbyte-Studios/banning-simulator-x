/// <reference types="@rbxts/testez/globals" />

import { assertDeepEqual } from "shared/mocks/assertDeepEqual";

import { currenciesReducer, CurrenciesState } from "../currencies";
import { experienceReducer, ExperienceState } from "../experience";
import { petsReducer, PetsState } from "../pets";
import { questsReducer, QuestsState, redeemWorldQuest, redeemZoneQuest } from "../quests";

export = (): void => {
	describe("rodux/quests", () => {
		it("should redeem a zone quest", () => {
			const state: QuestsState = {
				"Ban Land": {
					world: new Set(),
					zone: {},
				},
			};

			const action = redeemZoneQuest("Ban Land", "Desert", "Kill 15 mobs", 50, {
				kind: "title",
			});

			assertDeepEqual(questsReducer(state, action), {
				"Ban Land": {
					world: new Set<string>(),
					zone: {
						Desert: new Set(["Kill 15 mobs"]),
					},
				},
			});
		});

		it("should redeem a world quest", () => {
			const state: QuestsState = {
				"Ban Land": {
					world: new Set(),
					zone: {},
				},
			};

			const action = redeemWorldQuest("Ban Land", "Kill 30 mobs", 50, {
				kind: "title",
			});

			assertDeepEqual(questsReducer(state, action), {
				"Ban Land": {
					world: new Set(["Kill 30 mobs"]),
					zone: {},
				},
			});
		});

		it("should add experience when redeeming quest", () => {
			const state: ExperienceState = 100;

			const action = redeemWorldQuest("Ban Land", "Kill 30 mobs", 50, {
				kind: "title",
			});

			expect(experienceReducer(state, action)).to.equal(150);
		});

		it("should add currency when redeeming quest", () => {
			const state: CurrenciesState = { coins: 100, gems: 10 };

			const action = redeemWorldQuest("Ban Land", "Kill 30 mobs", 50, {
				kind: "currency",
				amount: 100,
				currency: "coins",
			});

			assertDeepEqual(currenciesReducer(state, action), {
				coins: 200,
				gems: 10,
			});
		});

		it("should add pet when redeeming quest", () => {
			const state: PetsState = [];

			const action = redeemWorldQuest("Ban Land", "Kill 30 mobs", 50, {
				kind: "pet",
				guid: "abc123",
				id: 40,
				variant: "regular",
			});

			assertDeepEqual(petsReducer(state, action), [
				{
					id: 40,
					guid: "abc123",
					equipped: false,
					locked: false,
					enhancements: {},
					variant: "regular",
				},
			]);
		});
	});
};
