/// <reference types="@rbxts/testez/globals" />

import Object from "@rbxts/object-utils";
import { currencies } from "shared/configs/currencies";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";

import { aurasReducer, AurasState, purchaseAura } from "../auras";
import { currenciesReducer } from "../currencies";

export = (): void => {
	describe("rodux/auras", () => {
		it("should allow purchasing an auras", () => {
			const auraId = 1;

			const state: AurasState = new Set();
			const newState: AurasState = new Set([auraId]);

			const action = purchaseAura({
				id: auraId,
				cost: {
					amount: 1000,
					currency: "gold",
					requiredRank: 1,
				},
			});

			assertDeepEqual(aurasReducer(state, action), newState);
		});

		it("should take away currency purchasing an aura", () => {
			const cost = 100;

			const state = Object.fromEntries(Object.values(currencies).map((currency) => [currency, cost] as const));
			const newState = { ...state, ["gold"]: 0 };

			const action = purchaseAura({
				id: 1,
				cost: {
					amount: cost,
					currency: "gold",
					requiredRank: 1,
				},
			});

			assertDeepEqual(currenciesReducer(state, action), newState);
		});
	});
};
