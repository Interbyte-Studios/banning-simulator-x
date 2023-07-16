import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";
import { isVariant, Variants } from "shared/configs/pets";

export const admin_SpawnPetDefinition = Net.Definitions.ClientToServerEvent<
	[
		targetPlayerId: number,
		petData: {
			petId: number;
			variant: Variants;
		},
	]
>([createTypeChecker(t.number, t.strictInterface({ petId: t.number, variant: isVariant }))]);
export type Admin_SpawnPetDefinition = typeof admin_SpawnPetDefinition;
