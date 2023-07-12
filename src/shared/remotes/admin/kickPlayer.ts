import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const admin_KickPlayerDefinition = Net.Definitions.ClientToServerEvent<[targetPlayerId: number]>([
	createTypeChecker(t.number),
]);
export type Admin_KickPlayerDefinition = typeof admin_KickPlayerDefinition;
