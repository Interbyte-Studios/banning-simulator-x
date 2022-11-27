import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";
import { isVariant, Variants } from "shared/configs/pets";

export const togglePetMasteryCosmetic = Net.Definitions.ClientToServerEvent<[petId: number, variant: Variants]>([
	createTypeChecker(t.number, isVariant),
]);
export type TogglePetMasteryCosmetic = typeof togglePetMasteryCosmetic;
