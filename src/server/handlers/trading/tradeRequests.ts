import { retrieveStore } from "server/playerStore";
import { Store } from "shared/rodux";
import { TRADING_ATTRIBUTE } from "shared/trading/tradingAttributes";

import { createTrade, getTradeStatus } from "./trades";

/**
 * Initiates a trade request from `player` to `targetPlayer`.
 *
 * Both `player` and `targetPlayer` cannot trade with other people until they have resolved the request.
 *
 * @param player The creator of the the trade request.
 * @param store The store of the creator.
 * @param targetPlayer The player whom the creator wants to trade with.
 */
export function requestTrade(player: Player, store: Store, targetPlayer: Player): void {
	// ensure that both players aren't currently trading
	const hasPlayerTrading = [player, targetPlayer].mapFiltered(getTradeStatus).size() !== 0;
	if (hasPlayerTrading) {
		return;
	}

	const playerStores = [store, retrieveStore(targetPlayer)];

	// make sure both players have trades enabled
	const hasPrivateTrader =
		playerStores
			.map((store) => store.getState().settings.privacy.tradesEnabled)
			.filter((hasTradesEnabled) => hasTradesEnabled)
			.size() !== 0;
	if (hasPrivateTrader) {
		return;
	}

	// indicate that both players are now trading
	createTrade(player, targetPlayer);

	// alert clients that trade request has been sent
	player.SetAttribute(TRADING_ATTRIBUTE, true);
	targetPlayer.SetAttribute(TRADING_ATTRIBUTE, true);
}
