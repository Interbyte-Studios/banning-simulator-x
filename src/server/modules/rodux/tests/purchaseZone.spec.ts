/// <reference types="@rbxts/testez/globals" />

import { createDummyStore } from "server/playerStore";
import { BAN_LAND_ZONES } from "shared/configs/zones/banLand";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";
import { useMockPlayer } from "shared/mocks/player";
import { getZoneData } from "shared/util/getZoneData";

import { purchaseZone } from "../purchaseZone";

export = (): void => {
	describe("purchaseZone", () => {
		it("should allow purchasing a zone", () => {
			const worldName = "Ban Land";
			const zoneName = "Desert";

			const player = useMockPlayer();
			const zoneData = getZoneData(worldName, zoneName);

			// give us enough currency to purchase zone
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {
				currencies: {
					coins: zoneData.cost?.amount,
				},
			});

			purchaseZone(store, worldName, zoneName);
			assertDeepEqual(dispatchedActions, [
				{
					type: "unlockZone",
					worldName: worldName,
					zoneName: zoneName,
					currency: { amount: BAN_LAND_ZONES[zoneName].cost.amount, type: BAN_LAND_ZONES[zoneName].cost.currency },
				},
			]);

			cleanup();
		});

		it("should not purchase a zone already owned", () => {
			const worldName = "Ban Land";
			const zoneName = "Desert";

			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {
				worlds: [
					{
						name: "Ban Land",
						zones: ["Forest", "Desert"],
					},
				],
			});

			purchaseZone(store, worldName, zoneName);
			assertDeepEqual(dispatchedActions, []);

			cleanup();
		});

		it("should not purchase a zone that cannot be bought", () => {
			// zone Forest cannot be bought
			const worldName = "Ban Land";
			const zoneName = "Forest";
			const zoneData = getZoneData(worldName, zoneName);

			// make sure the cost does not exist
			expect(zoneData.cost).to.equal(undefined);

			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {});

			purchaseZone(store, worldName, zoneName);
			assertDeepEqual(dispatchedActions, []);

			cleanup();
		});

		it("should not purchase a zone the player cant afford", () => {
			const worldName = "Ban Land";
			const zoneName = "Desert";

			const player = useMockPlayer();

			const { store, dispatchedActions, cleanup } = createDummyStore(player, { currencies: { coins: 500 } });
			purchaseZone(store, worldName, zoneName);
			assertDeepEqual(dispatchedActions, []);

			cleanup();
		});

		it("should not purchase a zone the player does not own the previous zone", () => {
			const worldName = "Ban Land";
			const zoneName = "Honeycomb";

			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {
				worlds: [{ name: "Ban Land", zones: ["Forest", "Desert"] }],
			});
			purchaseZone(store, worldName, zoneName);
			assertDeepEqual(dispatchedActions, []);

			cleanup();
		});
	});
};
