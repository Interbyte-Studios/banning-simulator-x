import { Players, ReplicatedStorage } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { retrieveStore } from "server/playerStore";
import { remotes } from "shared/remotes";

const sendTradeRequestRemote = remotes.Server.GetNamespace("trades").Create("sendTradeRequest");

remotes.Server.GetNamespace("trades")
	.Create("requestTrade")
	.Connect(
		withPlayerStore((player, store, targetPlayer) => {
			const playerIsActivelyTrading = ReplicatedStorage.activeTrades.FindFirstChild(player.Name);
			if (playerIsActivelyTrading !== undefined) {
				return;
			}

			if (store.getState().settings.privacy.tradesEnabled === false) {
				return;
			}

			const targetPlayerIsActivelyTrading = ReplicatedStorage.activeTrades.FindFirstChild(targetPlayer.Name);
			if (targetPlayerIsActivelyTrading !== undefined) {
				return;
			}

			const targetPlayerStore = retrieveStore(targetPlayer);
			if (targetPlayerStore.getState().settings.privacy.tradesEnabled === false) {
				return;
			}

			const verifiedTargetPlayer = Players.FindFirstChild(targetPlayer.Name);
			if (verifiedTargetPlayer === undefined) {
				return;
			}

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
