import Net from "@rbxts/net";
import { EggName } from "shared/configs/eggs";
import { HatchedPet } from "shared/rodux/pets";

export const conveyHatchDefinition =
	Net.Definitions.ServerToClientEvent<[eggName: EggName, pets: Array<HatchedPet>, isVoid: boolean]>();
export type ConveyHatchDefinition = typeof conveyHatchDefinition;
