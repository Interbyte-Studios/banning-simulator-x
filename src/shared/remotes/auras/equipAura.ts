import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const equipAuraDefinition = Net.Definitions.ClientToServerEvent<[auraId: number]>([
	createTypeChecker(t.integer),
]);
