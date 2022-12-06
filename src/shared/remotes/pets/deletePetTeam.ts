import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const deletePetTeamDefinition = Net.Definitions.ClientToServerEvent<[teamId: number]>([
	createTypeChecker(t.number),
]);
export type DeletePetTeamDefinition = typeof deletePetTeamDefinition;
