import Net from "@rbxts/net";
import { EggName } from "shared/configs/eggs";

export const hatchTripleExclusivePetDefinition =
	Net.Definitions.ServerToClientEvent<[eggName: EggName, pets: Array<number>]>();
export type HatchTripleExclusivePetDefinition = typeof hatchTripleExclusivePetDefinition;
