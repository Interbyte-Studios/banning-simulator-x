import Net from "@rbxts/net";
import { BOOST_PRODUCTS } from "shared/configs/game";
import { ValidBoostTime } from "shared/rodux/boosts";

export const useBoostDefinition = Net.Definitions.ClientToServerEvent<
	[boostName: keyof typeof BOOST_PRODUCTS, boostTime: ValidBoostTime]
>([]);
export type UseBoostDefinition = typeof useBoostDefinition;
