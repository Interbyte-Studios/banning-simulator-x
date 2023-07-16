import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { BoostProduct, isBoost } from "shared/configs/game";
import { ValidBoostTime } from "shared/rodux/boosts";

import { validBoostTime } from "../rodux/boosts";

export const useBoostDefinition = Net.Definitions.ClientToServerEvent<
	[boostName: BoostProduct, boostTime: ValidBoostTime]
>([createTypeChecker(isBoost, validBoostTime)]);
export type UseBoostDefinition = typeof useBoostDefinition;
