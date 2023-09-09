import Net from "@rbxts/net";
import { EggName } from "shared/configs/eggs";
import { HatchedPet } from "shared/rodux/pets";

export const conveyHatchDefinition = Net.Definitions.ServerToClientEvent<[eggName: EggName, pets: Array<HatchedPet>]>();
export type ConveyHatchDefinition = typeof conveyHatchDefinition;
