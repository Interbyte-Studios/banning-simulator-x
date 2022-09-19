/// <reference types="@rbxts/testez/globals" />

import { assertDeepEqual } from "shared/mocks/assertDeepEqual";
import { getEggCost } from "shared/util/getEggCost";

import { eggsReducer, EggsState } from "../eggs";
import { addPets } from "../pets";

export = (): void => {
	describe("rodux/eggs", () => {
		it("should increase total eggs hatched counter", () => {
			const eggName = "Starter";
			const eggCost = getEggCost(eggName, false);
			const petId = 1;

			const state: EggsState = {
				eggs: 0,
				rarities: {
					Basic: 0,
					Ordinary: 0,
					Rare: 0,
					Epic: 0,
					Legendary: 0,
					Primordial: 0,
					Prismatic: 0,
				},
			};

			const newState: EggsState = { ...state };
			newState.eggs += 1;

			const action = addPets(eggCost.amount, eggCost.currencyType, [
				{ autoDeleted: false, id: petId, rarity: "Basic", variant: "regular" },
			]);

			assertDeepEqual(eggsReducer(state, action), newState);
		});

		it("should increase rarity specific eggs hatched counter", () => {
			const eggName = "Starter";
			const eggCost = getEggCost(eggName, false);
			const petId = 1;

			const state: EggsState = {
				eggs: 0,
				rarities: {
					Basic: 0,
					Ordinary: 0,
					Rare: 0,
					Epic: 0,
					Legendary: 0,
					Primordial: 0,
					Prismatic: 0,
				},
			};

			const newState: EggsState = { ...state };
			newState.eggs += 1;
			newState.rarities.Basic += 1;

			const action = addPets(eggCost.amount, eggCost.currencyType, [
				{ autoDeleted: false, id: petId, rarity: "Basic", variant: "regular" },
			]);

			assertDeepEqual(eggsReducer(state, action), newState);
		});
	});
};
