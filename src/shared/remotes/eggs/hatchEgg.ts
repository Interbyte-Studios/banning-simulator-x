import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";
import { EggName, isEggName } from "shared/configs/eggs";

export const validEggAmount = t.literal(1, 2, 3, 4, 5);
export type ValidEggAmount = t.static<typeof validEggAmount>;

export const hatchEggDefinition = Net.Definitions.ClientToServerEvent<
	[amount: ValidEggAmount, egg: EggName, isVoid: boolean]
>([createTypeChecker(validEggAmount, isEggName, t.boolean)]);
export type HatchEggDefinition = typeof hatchEggDefinition;
