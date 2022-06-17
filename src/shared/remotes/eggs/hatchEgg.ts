import Net from "@rbxts/net";
import { EggName } from "shared/configs/eggs";
import { PetData } from "shared/rodux/pets";

export interface ConfirmedPet extends PetData {
	autoDeleted: boolean;
}

export const hatchEggDefinition =
	Net.Definitions.ServerAsyncFunction<
		(amount: 1 | 3, egg: EggName, isVoid: boolean) => { success: false } | { success: true; pets: Array<ConfirmedPet> }
	>();
export type HatchEggDefinition = typeof hatchEggDefinition;
