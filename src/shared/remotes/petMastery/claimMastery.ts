import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";
import { isVariant, Variants } from "shared/configs/pets";
import { PetAttainMethod } from "shared/rodux/pets";

export enum ClaimPetMasteryFailKind {
	InternalError,
	UndiscoveredPet,
	UndiscoveredVariant,
	NotEnoughHatches,
	NotEnoughMaxLevels,
	NotEnoughFusions,
	InvalidMastery,
}

export const claimPetMasteryDefinition = Net.Definitions.ServerAsyncFunction<
	(
		petId: number,
		variant: Variants,
		method: PetAttainMethod,
	) => { success: true } | { success: false; reason: ClaimPetMasteryFailKind }
>([createTypeChecker(t.number, isVariant, t.literal("maxLevel", "hatch", "fuse"))]);
export type ClaimPetMasteryDefinition = typeof claimPetMasteryDefinition;
