import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { BoostProduct, isBoost } from "shared/configs/game";
import { WorldName } from "shared/configs/worlds";
import { ValidBoostTime, validBoostTime } from "shared/rodux/boosts";
import { isValidWorld } from "shared/util/isValidWorld";

export const purchasePrestigeBoostDefinition = Net.Definitions.ClientToServerEvent<
	[worldName: WorldName, boostName: BoostProduct, boostTime: ValidBoostTime]
>([createTypeChecker(isValidWorld, isBoost, validBoostTime)]);
export type PurchasePrestigeBoostDefinition = typeof purchasePrestigeBoostDefinition;
