import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { WorldName } from "shared/configs/worlds";
import { isValidZone, ZoneNames } from "shared/configs/zones";
import { isValidWorld } from "shared/util/isValidWorld";

export type PurchaseWorldReturnType = { success: true } | { success: false; reason: PurchaseWorldFailKind };

export enum PurchaseWorldFailKind {
	NotEnoughCurrency,
	NotRequiredRank,
	NonlinearProgression,
	InternalError,
}

export const purchaseWorldDefinition = Net.Definitions.ServerAsyncFunction<
	(world: WorldName, zone: ZoneNames) => PurchaseWorldReturnType
>([createTypeChecker(isValidWorld, isValidZone)]);
export type PurchaseWorldDefinition = typeof purchaseWorldDefinition;
