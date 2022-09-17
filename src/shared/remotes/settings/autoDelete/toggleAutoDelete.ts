import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";
import { Rarities } from "shared/configs/rarities";
import { ImmuneRarities } from "shared/rodux/autoDelete";

export const toggleAutoDeleteDefinition = Net.Definitions.ClientToServerEvent<
	[rarity: Exclude<Rarities, ImmuneRarities>]
>([createTypeChecker(t.union(t.literal("Basic"), t.literal("Ordinary"), t.literal("Rare"), t.literal("Epic")))]);
export type ToggleAutoDeleteDefinition = typeof toggleAutoDeleteDefinition;
