import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const purchaseTalismanDefinition = Net.Definitions.ClientToServerEvent<[talismanId: number]>([
	createTypeChecker(t.integer),
]);
export type PurchaseTalismanDefinition = typeof purchaseTalismanDefinition;
