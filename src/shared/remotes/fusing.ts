import Net from "@rbxts/net";
import { Variants } from "shared/configs/pets";

export type FusionReturnType = { success: true } | { success: false; reason: FusionFailKind };

export enum FusionFailKind {
	NotEnoughCurrency,
	InternalError,
	PetsNotSameId,
	UnsuccesfulFusion,
}

export const fusionRequestDefinition = Net.Definitions.ServerAsyncFunction<
	(petsToFuse: Array<string>, variant: Variants) => FusionReturnType
>([]);
export type FusionRequestDefinition = typeof fusionRequestDefinition;
