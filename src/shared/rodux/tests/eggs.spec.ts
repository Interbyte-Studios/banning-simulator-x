/// <reference types="@rbxts/testez/globals" />

import { getEggCost } from "shared/util/getEggCost";

import { eggsReducer } from "../eggs";
import { addPets } from "../pets";
import { testAction } from "./testAction";

export = (): void => {
	describe("rodux/eggs", () => {
		it("should increase total eggs hatched counter", () => {
			const eggName = "Starter";
			const eggCost = getEggCost(eggName, false);
			const petId = 1;

			const state = {
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

			const newState = { ...state, eggs: state.eggs + 1 };

			const action = addPets(eggCost.amount, eggCost.currencyType, [
				{ autoDeleted: false, id: petId, rarity: "Basic", variant: "regular", method: "hatch", egg: "Starter" },
			]);

			testAction(state, newState, eggsReducer, action);
		});

		it("should increase rarity specific eggs hatched counter", () => {
			const eggName = "Starter";
			const eggCost = getEggCost(eggName, false);
			const petId = 1;

			const state = {
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

			const newState = {
				...state,
				eggs: state.eggs + 1,
				rarities: {
					...state["rarities"],
					Basic: state.rarities.Basic + 1,
				},
			};

			const action = addPets(eggCost.amount, eggCost.currencyType, [
				{ autoDeleted: false, id: petId, rarity: "Basic", variant: "regular", method: "hatch", egg: "Starter" },
			]);

			testAction(state, newState, eggsReducer, action);
		});
	});
};
