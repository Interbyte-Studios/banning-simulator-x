import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const retrieveTradeOffersDefinition = Net.Definitions.ClientToServerEvent<[creator: Player, receiver: Player]>([
	createTypeChecker(t.instanceIsA("Player"), t.instanceIsA("Player")),
]);
export type RetrieveTradeOffersDefinition = typeof retrieveTradeOffersDefinition;
