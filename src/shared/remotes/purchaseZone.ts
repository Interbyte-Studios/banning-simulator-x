import Net from "@rbxts/net";
import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";

export const purchaseZoneDefiinition = Net.Definitions.ClientToServerEvent<[world: WorldName, zone: ZoneNames]>();
export type PurchaseZoneDefinition = typeof purchaseZoneDefiinition;
