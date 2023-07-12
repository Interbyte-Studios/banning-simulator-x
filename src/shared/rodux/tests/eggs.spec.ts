/// <reference types="@rbxts/testez/globals" />

import { eggsReducer, hatchEgg } from "../eggs";
import { testAction } from "./testAction";

export = (): void => {
	describe("rodux/eggs", () => {
		it("should increase egg counter and rarity counter", () => {
			const petId = 1;
			const petGuid = "1";

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
					Exclusive: 0,
				},
			};

			const newState = {
				eggs: 1,
				rarities: {
					...state.rarities,
					Basic: 1,
				},
			};

			const action = hatchEgg(0, "coins", [
				{
					autoDeleted: false,
					id: petId,
					guid: petGuid,
					variant: "regular",
					tradeLocked: false,
				},
			]);

			testAction(state, newState, eggsReducer, action);
		});
	});
};
