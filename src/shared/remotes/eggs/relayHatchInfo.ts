import Net from "@rbxts/net";
import { EggNames } from "shared/configs/eggs";

export const relayHatchDefinition =
	Net.Definitions.ServerToClientEvent<[eggName: EggNames, pets: Array<number>, isVoid: boolean]>();
export type RelayHatchDefinition = typeof relayHatchDefinition;
