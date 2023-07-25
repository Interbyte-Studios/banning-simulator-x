import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { isTimeTrialDifficulty, TimeTrialDifficulty } from "shared/configs/timeTrials";

export const createTimeTrialDefinition = Net.Definitions.ClientToServerEvent<[difficulty: TimeTrialDifficulty]>([
	createTypeChecker(isTimeTrialDifficulty),
]);
export type CreateTimeTrialDefinition = typeof createTimeTrialDefinition;
