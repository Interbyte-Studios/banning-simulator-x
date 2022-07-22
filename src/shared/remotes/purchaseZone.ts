import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { isValidWorld } from "shared/util/isValidWorld";
import { isValidZone } from "shared/util/isValidZone";

export const purchaseZoneDefiinition = Net.Definitions.ClientToServerEvent<[world: WorldName, zone: ZoneNames]>([
	createTypeChecker(isValidWorld, isValidZone),
]);
export type PurchaseZoneDefinition = typeof purchaseZoneDefiinition;
