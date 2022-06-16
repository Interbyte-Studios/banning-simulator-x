import Net from "@rbxts/net";
import { EggName } from "shared/configs/eggs";

export interface ConfirmedPet {
	id: number;
	autoDeleted: boolean;
}

export const hatchEggDefinition =
	Net.Definitions.ServerAsyncFunction<(amount: 1 | 3, egg: EggName, isVoid: boolean) => Array<ConfirmedPet>>();
export type HatchEggDefinition = typeof hatchEggDefinition;
