import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const requestTradeDefinition = Net.Definitions.ClientToServerEvent<[targetPlayer: Player]>([
	createTypeChecker(t.instanceIsA("Player")),
]);
export type RequestTradeDefinition = typeof requestTradeDefinition;
