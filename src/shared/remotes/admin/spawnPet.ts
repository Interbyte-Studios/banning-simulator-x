import Net from "@rbxts/net";
import { Variants } from "shared/configs/pets";

export const admin_SpawnPetDefinition = Net.Definitions.ClientToServerEvent<
	[
		targetPlayerId: number,
		petData: {
			petId: number;
			variant: Variants;
		},
	]
>([]);
export type Admin_SpawnPetDefinition = typeof admin_SpawnPetDefinition;
