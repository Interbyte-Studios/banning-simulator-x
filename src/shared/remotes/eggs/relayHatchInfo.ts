import Net from "@rbxts/net";
import { EggNames } from "shared/configs/eggs";

export const relayHatchDefinition =
	Net.Definitions.ServerToClientEvent<[amount: 1 | 2 | 3, eggName: EggNames, pets: Array<number>, isVoid: boolean]>();
export type RelayHatchDefinition = typeof relayHatchDefinition;
