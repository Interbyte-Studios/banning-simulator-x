import Net from "@rbxts/net";
import { PlayerTradeItem } from "shared/configs/trading";

export const finalizedTradeConfirmedDefinition =
	Net.Definitions.ServerToClientEvent<[player: Player, tradeItems: PlayerTradeItem]>();
export type FinalizedTradeConfirmedDefinition = typeof finalizedTradeConfirmedDefinition;
