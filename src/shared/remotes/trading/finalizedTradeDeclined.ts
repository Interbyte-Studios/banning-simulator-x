import Net from "@rbxts/net";
import { PlayerTradeItem } from "shared/configs/trading";

export const finalizedTradeDeclinedDefinition =
	Net.Definitions.ServerToClientEvent<[player: Player, tradeItems: PlayerTradeItem]>();
export type FinalizedTradeDeclinedDefinition = typeof finalizedTradeDeclinedDefinition;
