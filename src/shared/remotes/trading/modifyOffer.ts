import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { isPlayerTradeItem, PlayerTradeItem } from "shared/configs/trading";

export const modifyOfferDefinition = Net.Definitions.ClientToServerEvent<[newOffer: PlayerTradeItem]>([
	createTypeChecker(isPlayerTradeItem),
]);
export type ModifyOfferDefinition = typeof modifyOfferDefinition;
