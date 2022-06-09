/// <reference types="@rbxts/testez/globals" />

import { createDummyStore } from "server/playerStore";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";
import { useMockPlayer } from "shared/mocks/player";

import { purchaseEgg } from "../purchaseEgg";

export = (): void => {
	describe("purchaseEgg", () => {
		it("should not purchase an egg the player does not own the pre-requisite zone for", () => {
			const eggName = "Desert";
			const petId = 7;
			const isVoid = false;

			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {
				worlds: [{ isOwned: true, name: "Ban Land", zones: [{ isOwned: true, name: "Forest" }] }],
			});

			expect(() => purchaseEgg(store, eggName, petId, isVoid)).to.throw();
			assertDeepEqual(dispatchedActions, [
				{
					type: "addPet",
					eggName: eggName,
					id: petId,
					variant: "regular",
				},
			]);

			cleanup();
		});

		it("should not purchase an egg the player cannot afford", () => {
			const eggName = "Starter";
			const petId = 1;
			const isVoid = false;

			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, { currencies: { gold: 450 } });

			// should throw an error when purchasing
			expect(() => purchaseEgg(store, eggName, petId, isVoid)).to.throw();
			assertDeepEqual(dispatchedActions, []);

			cleanup();
		});

		it("should allow purchasing an egg", () => {
			const eggName = "Starter";
			const petId = 1;
			const isVoid = false;

			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {
				pets: [],
			});

			purchaseEgg(store, eggName, petId, isVoid);
			assertDeepEqual(dispatchedActions, [
				{
					type: "addPet",
					eggName: eggName,
					id: petId,
					variant: "regular",
				},
			]);

			cleanup();
		});
	});
};
