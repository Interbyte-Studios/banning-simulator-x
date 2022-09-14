import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { ValidRank } from "shared/rodux/rank";

export const unlockRankDefinition = Net.Definitions.ClientToServerEvent<[rank: number]>([createTypeChecker(ValidRank)]);
export type UnlockRankDefinition = typeof unlockRankDefinition;
