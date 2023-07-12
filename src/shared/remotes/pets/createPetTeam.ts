import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const createPetTeamDefinition = Net.Definitions.ClientToServerEvent<[pets: Array<string>]>([
	createTypeChecker(t.strictArray(t.string)),
]);
export type CreatePetTeamDefinition = typeof createPetTeamDefinition;
