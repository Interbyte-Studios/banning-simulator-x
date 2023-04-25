import Net from "@rbxts/net";
import type { PlayerTradeItem } from "server/handlers/trading/trades";

/**
 * `player` references the player that had their offer changed.
 *
 * This could be the source player firing a `modifyOffer` request if their new offer was rejected.
 *
 * `newOffer` contains the player's offer.
 */
export const offerChangedDefinition =
	Net.Definitions.ServerToClientEvent<[player: Player, newOffer: Readonly<PlayerTradeItem>]>();
export type OfferChangedDefinition = typeof offerChangedDefinition;
