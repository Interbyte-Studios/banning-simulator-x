import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const admin_ModifyRankDefinition = Net.Definitions.ClientToServerEvent<[targetPlayerId: number, rank: number]>([
	createTypeChecker(t.number, t.number),
]);
export type Admin_ModifyRankDefinition = typeof admin_ModifyRankDefinition;
