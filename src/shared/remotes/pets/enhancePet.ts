import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";
import { Variants } from "shared/configs/pets";

export enum EnhancePetFailKind {
	PetDoesNotExist,
	NotEnoughCurrency,
	RaritySlotUnavailable,
	InternalError,
}

export const enhancePetDefinition = Net.Definitions.ServerAsyncFunction<
	(guid: string, id: number, variant: Variants) => { success: false; reason: EnhancePetFailKind } | { success: true }
>([createTypeChecker(t.string, t.number, t.literal("regular", "void", "radiant"))]);
export type EnhancePetDefinition = typeof enhancePetDefinition;
