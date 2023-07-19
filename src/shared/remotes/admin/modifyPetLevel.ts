import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const admin_ModifyPetLevelDefinition = Net.Definitions.ClientToServerEvent<
	[
		targetPlayerId: number,
		petData: {
			petGuid: string;
			level: number;
		},
	]
>([createTypeChecker(t.number, t.strictInterface({ petGuid: t.string, level: t.number }))]);
export type Admin_ModifyPetLevelDefinition = typeof admin_ModifyPetLevelDefinition;
