import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const acceptTradeRequestDefinition = Net.Definitions.ClientToServerEvent<[creator: Player]>([
	createTypeChecker(t.instanceIsA("Player")),
]);
export type AcceptTradeRequestDefinition = typeof acceptTradeRequestDefinition;
