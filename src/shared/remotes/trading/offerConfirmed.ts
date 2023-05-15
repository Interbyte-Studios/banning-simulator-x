import Net from "@rbxts/net";
import { PlayerTradeItem } from "shared/configs/trading";

export const tradeOfferConfirmedDefinition =
	Net.Definitions.ServerToClientEvent<[player: Player, tradeItems: PlayerTradeItem]>();
export type TradeOfferConfirmedDefinition = typeof tradeOfferConfirmedDefinition;
