import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { WorldName } from "shared/configs/worlds";
import { isValidWorld } from "shared/util/isValidWorld";

export const purchaseWorldPrestigeVoidEggUpgradeDefinition = Net.Definitions.ClientToServerEvent<
	[worldName: WorldName]
>([createTypeChecker(isValidWorld)]);
export type PurchaseWorldPrestigeVoidEggUpgradeDefinition = typeof purchaseWorldPrestigeVoidEggUpgradeDefinition;
