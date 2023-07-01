import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";
import { EggName, isEggName } from "shared/configs/eggs";
import { HatchedPet } from "shared/rodux/pets";

export const validEggEmount = t.literal(1, 2, 3);
export type ValidEggAmount = t.static<typeof validEggEmount>;

export const hatchEggDefinition = Net.Definitions.ServerAsyncFunction<
	(
		amount: ValidEggAmount,
		egg: EggName,
		isVoid: boolean,
	) => { success: false } | { success: true; pets: Array<HatchedPet> }
>([createTypeChecker(t.literal(1, 2, 3), isEggName, t.boolean)]);
export type HatchEggDefinition = typeof hatchEggDefinition;
