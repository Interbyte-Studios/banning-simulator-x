import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { isTimeTrialDifficulty, TimeTrialDifficulty } from "shared/configs/timeTrials";

export const createTimeTrialDefinition = Net.Definitions.ServerAsyncFunction<
	(difficulty: TimeTrialDifficulty) => { success: false } | { success: true; spawnLocation: Vector3 }
>([createTypeChecker(isTimeTrialDifficulty)]);
export type CreateTimeTrialDefinition = typeof createTimeTrialDefinition;
