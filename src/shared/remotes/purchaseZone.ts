import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { WorldName } from "shared/configs/worlds";
import { isValidZone, ZoneNames } from "shared/configs/zones";
import { isValidWorld } from "shared/util/isValidWorld";

export type PurchaseZoneReturnType = { success: true } | { success: false; reason: PurchaseZoneFailKind };

export enum PurchaseZoneFailKind {
	NotEnoughCurrency,
	NotRequiredRank,
	NonlinearProgression,
	InternalError,
}

export const purchaseZoneDefinition = Net.Definitions.ServerAsyncFunction<
	(world: WorldName, zone: ZoneNames) => PurchaseZoneReturnType
>([createTypeChecker(isValidWorld, isValidZone)]);
export type PurchaseZoneDefinition = typeof purchaseZoneDefinition;
