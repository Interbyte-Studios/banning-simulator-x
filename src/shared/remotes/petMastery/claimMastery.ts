import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";
import { isVariant, Variants } from "shared/configs/pets";

export enum ClaimPetMasteryFailKind {
	InternalError,
	UndiscoveredPet,
	UndiscoveredVariant,
	NotEnoughHatches,
	NotEnoughMaxLevels,
	NotEnoughFusions,
}

export const claimPetMasteryDefinition = Net.Definitions.ServerAsyncFunction<
	(petId: number, variant: Variants) => { success: true } | { success: false; reason: ClaimPetMasteryFailKind }
>([createTypeChecker(t.number, isVariant)]);
export type ClaimPetMasteryDefinition = typeof claimPetMasteryDefinition;
