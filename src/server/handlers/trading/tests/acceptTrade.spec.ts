/// <reference types="@rbxts/testez/globals" />

import { createDummyStore } from "server/playerStore";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";
import { useMockPlayer } from "shared/mocks/player";
import { Store, StoreActions } from "shared/rodux";

import { acceptTrade, createTrade, getTrade, getTradeStatus, TradeStatus, Trading } from "../trades";

interface FakeTradePlayer {
	player: Player;
	store: Store;
	dispatchedActions: Array<StoreActions>;
}

/**
 * Creates fake players to use for trading tests.
 *
 * @returns The fake players.
 */
function createPlayers(): { players: Array<FakeTradePlayer>; cleanup: () => void } {
	const mockPlayers: Array<FakeTradePlayer> = [];

	const cleanupFuncs: Array<() => void> = [];

	for (let i = 0; i < 4; i++) {
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
			dispatchedActions,
		});
		cleanupFuncs.push(cleanup);
	}

	return {
		players: mockPlayers,
		// eslint-disable-next-line jsdoc/require-jsdoc
		cleanup: (): void => {
			for (const cleanup of cleanupFuncs) {
				cleanup();
			}
		},
	};
}

export = (): void => {
	describe("acceptTrade", () => {
		it("should not throw when called with non-existent trades", () => {
			const {
				players: [a, b],
				cleanup,
			} = createPlayers();

			expect(acceptTrade(a.player, b.player)).to.never.throw();

			cleanup();
		});

		it("should not allow creator to accept trade on behalf of someone", () => {
			const {
				players: [a, b],
				cleanup,
			} = createPlayers();

			createTrade(a.player, b.player);
			// a should not be able to accept for b
			acceptTrade(a.player, b.player);

			expect(getTradeStatus(a.player)).to.equal(TradeStatus.TradeSent);
			expect(getTradeStatus(b.player)).to.equal(TradeStatus.TradeSent);

			cleanup();
		});

		it("should allow trade request acceptance", () => {
			const {
				players: [a, b],
				cleanup,
			} = createPlayers();

			createTrade(a.player, b.player);
			acceptTrade(b.player, a.player);

			const tradeStatus: Trading = {
				status: TradeStatus.Trading,
				items: [
					{
						player: a.player,
						items: [],
					},
					{
						player: b.player,
						items: [],
					},
				],
			};
			assertDeepEqual(getTrade(a.player), tradeStatus);

			cleanup();
		});

		it("should not accept a trade with wrong players", () => {
			const {
				players: [a, b, c, d],
				cleanup,
			} = createPlayers();

			createTrade(a.player, b.player);
			createTrade(c.player, d.player);

			// attempt to accept a trade with c from b
			acceptTrade(b.player, c.player);

			// should not have accepted
			expect(getTradeStatus(b.player)).to.equal(TradeStatus.TradeSent);

			cleanup();
		});
	});
};
