/// <reference types="@rbxts/testez/globals" />

import { addEgg, eggsReducer } from "../eggs";
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
				},
			};

			const newState = {
				eggs: 1,
				rarities: {
					...state.rarities,
					Basic: 1,
				},
			};

			const action = addEgg([
				{
					autoDeleted: false,
					id: petId,
					guid: petGuid,
					variant: "regular",
					method: "hatch",
					tradeLocked: false,
				},
			]);

			testAction(state, newState, eggsReducer, action);
		});
	});
};
