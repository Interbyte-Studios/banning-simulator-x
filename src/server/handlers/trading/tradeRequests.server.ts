import { ReplicatedStorage } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { retrieveStore } from "server/playerStore";
import { remotes } from "shared/remotes";

import { createTrade, getTradeStatus } from "./trades";

const sendTradeRequestRemote = remotes.Server.GetNamespace("trades").Create("sendTradeRequest");

remotes.Server.GetNamespace("trades")
	.Create("requestTrade")
	.Connect(
		withPlayerStore((player, store, targetPlayer) => {
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
					.filter((hasTradesEnabled) => !hasTradesEnabled)
					.size() !== 0;
			if (hasPrivateTrader) {
				return;
			}

			// indicate that both players are now trading
			createTrade(player, targetPlayer);

			const playerTradingCache = new Instance("ObjectValue");
			playerTradingCache.Name = player.Name;
			playerTradingCache.Value = targetPlayer;
			playerTradingCache.Parent = ReplicatedStorage.activeTrades;

			const targetPlayerTradingCache = new Instance("ObjectValue");
			targetPlayerTradingCache.Name = targetPlayer.Name;
			targetPlayerTradingCache.Value = player;
			targetPlayerTradingCache.Parent = ReplicatedStorage.activeTrades;

			sendTradeRequestRemote.SendToPlayer(targetPlayer);
		}),
	);
