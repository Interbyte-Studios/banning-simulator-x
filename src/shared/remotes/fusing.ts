import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";
import { FusableVariant, isValidFusableVariant } from "shared/rodux/pets";

export type FusionReturnType = { success: true } | { success: false; reason: FusionFailKind };

export enum FusionFailKind {
	NotEnoughCurrency,
	InternalError,
	PetsNotSameId,
	UnsuccesfulFusion,
}

export const fusionRequestDefinition = Net.Definitions.ServerAsyncFunction<
	(petsToFuse: Array<string>, variant: FusableVariant) => FusionReturnType
>([createTypeChecker(t.array(t.string), isValidFusableVariant)]);
export type FusionRequestDefinition = typeof fusionRequestDefinition;
