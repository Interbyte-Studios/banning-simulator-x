import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { isValidQuest } from "shared/configs/quests";

export const redeemQuestDefinition = Net.Definitions.ClientToServerEvent<[quest: string]>([
	createTypeChecker(isValidQuest),
]);
export type RedeemQuestDefinition = typeof redeemQuestDefinition;
