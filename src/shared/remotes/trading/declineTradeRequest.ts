import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const declineTradeRequestDefinition = Net.Definitions.ClientToServerEvent<[creator: Player]>([
	createTypeChecker(t.instanceIsA("Player")),
]);
export type DeclineTradeRequestDefinition = typeof declineTradeRequestDefinition;
