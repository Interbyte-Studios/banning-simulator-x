import Net from "@rbxts/net";
import { EggName } from "shared/configs/eggs";

export const hatchSingleExclusivePetDefinition =
	Net.Definitions.ServerToClientEvent<[eggName: EggName, petId: number]>();
export type HatchSingleExclusivePetDefinition = typeof hatchSingleExclusivePetDefinition;
