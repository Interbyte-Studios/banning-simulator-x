/// <reference types="@rbxts/testez/globals" />

import { assertDeepEqual } from "shared/mocks/assertDeepEqual";

import { eggsReducer, EggsState } from "../eggs";
import { addPet } from "../pets";

export = (): void => {
	describe("rodux/eggs", () => {
		it("should increase total eggs hatched counter", () => {
			const eggName = "Starter";
			const petId = 1;

			const state: EggsState = {
				eggsHatched: 0,
				basicHatched: 0,
				ordinaryHatched: 0,
				rareHatched: 0,
				primordialHatched: 0,
				prismaticHatched: 0,
			};

			const newState: EggsState = { ...state };
			newState.eggsHatched += 1;

			const action = addPet(eggName, petId, "regular");

			assertDeepEqual(eggsReducer(state, action), newState);
		});

		it("should increase rarity specific eggs hatched counter", () => {
			const eggName = "Starter";
			const petId = 1;

			const state: EggsState = {
				eggsHatched: 0,
				basicHatched: 0,
				ordinaryHatched: 0,
				rareHatched: 0,
				primordialHatched: 0,
				prismaticHatched: 0,
			};

			const newState: EggsState = { ...state };
			newState.eggsHatched += 1;
			newState.basicHatched += 1;

			const action = addPet(eggName, petId, "regular");

			assertDeepEqual(eggsReducer(state, action), newState);
		});
	});
};
