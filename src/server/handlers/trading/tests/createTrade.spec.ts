/// <reference types="@rbxts/testez/globals" />

import { createDummyStore } from "server/playerStore";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";
import { useMockPlayer } from "shared/mocks/player";
import { Store, StoreActions } from "shared/rodux";

import { requestTrade } from "../tradeRequests";
import { getTrade, getTradeStatus, TradeStatus } from "../trades";

interface FakeTradePlayer {
	player: Player;
	store: Store;
	cleanup: () => void;
	dispatchedActions: Array<StoreActions>;
}

/**
 * Creates fake players to use for trading tests.
 *
 * @returns The fake players.
 */
function createPlayers(): Array<FakeTradePlayer> {
	const mockPlayers: Array<FakeTradePlayer> = [];

	for (let i = 0; i < 3; i++) {
		const newMockPlayer = useMockPlayer();

		const { store, cleanup, dispatchedActions } = createDummyStore(newMockPlayer, {
			settings: {
				privacy: {
					// the last player we want to have a hidden inventory
					tradesEnabled: i === 2,
				},
			},
		});

		mockPlayers.push({
			player: newMockPlayer,
			store,
			cleanup,
			dispatchedActions,
		});
	}

	return mockPlayers;
}

export = (): void => {
	describe("tradeRequests", () => {
		it("should allow a player to create a trade request", () => {
			const [a, b, c] = createPlayers();

			// we should be able to make a trade request from a to b
			requestTrade(a.player, a.store, b.player);

			// trade should exist
			const [aTrade, bTrade] = [getTrade(a.player), getTrade(b.player)];

			const createdTrade = {
				status: identity<TradeStatus.TradeSent>(TradeStatus.TradeSent),
				sender: a.player,
				receiver: b.player,
			};

			// the trade should have been made for `a` and `b`
			assertDeepEqual(aTrade, createdTrade);
			assertDeepEqual(bTrade, createdTrade);

			// but not for c!
			expect(getTradeStatus(c.player)).to.equal(undefined);

			a.cleanup();
			b.cleanup();
			c.cleanup();
		});

		it("shouldn't allow you to create more than 2 trade requests", () => {
			const [a, b, c] = createPlayers();

			// we should be able to make a trade request from a to b
			requestTrade(a.player, a.store, b.player);
			// now try make a trade from a to c
			requestTrade(a.player, a.store, c.player);

			// the trade should still exist between a and b
			const [aTrade, bTrade] = [getTrade(a.player), getTrade(b.player)];
			const createdTrade = {
				status: identity<TradeStatus.TradeSent>(TradeStatus.TradeSent),
				sender: a.player,
				receiver: b.player,
			};
			assertDeepEqual(aTrade, createdTrade);
			assertDeepEqual(bTrade, createdTrade);

			// and no trade made for c
			expect(getTradeStatus(c.player)).to.equal(undefined);

			a.cleanup();
			b.cleanup();
			c.cleanup();
		});

		it("should respect privacy settings", () => {
			const [a, b, c] = createPlayers();

			// we should not be able to make a trade between a and c
			requestTrade(a.player, a.store, c.player);
			expect(getTradeStatus(a.player)).to.equal(undefined);
			expect(getTradeStatus(c.player)).to.equal(undefined);

			// and neither from c to a
			requestTrade(c.player, c.store, a.player);
			expect(getTradeStatus(a.player)).to.equal(undefined);
			expect(getTradeStatus(c.player)).to.equal(undefined);

			a.cleanup();
			b.cleanup();
			c.cleanup();
		});

		it("does create attributes on players", () => {
			const [a, b] = createPlayers();

			requestTrade(a.player, a.store, b.player);
			expect(a.player.GetAttribute("tradingPair")).to.equal(true);
			expect(b.player.GetAttribute("tradingPair")).to.equal(true);

			a.cleanup();
			b.cleanup();
		});
	});
};
