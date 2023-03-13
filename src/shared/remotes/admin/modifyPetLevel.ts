import Net from "@rbxts/net";

export const admin_ModifyPetLevelDefinition = Net.Definitions.ClientToServerEvent<
	[
		targetPlayerId: number,
		petData: {
			petGuid: string;
			level: number;
		},
	]
>([]);
export type Admin_ModifyPetLevelDefinition = typeof admin_ModifyPetLevelDefinition;
