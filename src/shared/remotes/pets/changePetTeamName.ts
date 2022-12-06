import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const changePetTeamNameDefinition = Net.Definitions.ClientToServerEvent<[teamId: number, name: string]>([
	createTypeChecker(t.number, t.string),
]);
export type ChangePetTeamNameDefinition = typeof changePetTeamNameDefinition;
