import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";
import { EggName, isEggName } from "shared/configs/eggs";
import { PetData } from "shared/rodux/pets";

export interface ConfirmedPet extends PetData {
	autoDeleted: boolean;
}

export const hatchEggDefinition = Net.Definitions.ServerAsyncFunction<
	(amount: 1 | 3, egg: EggName, isVoid: boolean) => { success: false } | { success: true; pets: Array<ConfirmedPet> }
>([createTypeChecker(t.literal(1, 3), isEggName, t.boolean)]);
export type HatchEggDefinition = typeof hatchEggDefinition;
