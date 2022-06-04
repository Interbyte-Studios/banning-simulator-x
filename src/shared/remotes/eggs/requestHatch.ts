import Net from "@rbxts/net";
import { EggNames } from "shared/configs/eggs";

export const requestHatchDefinition =
	Net.Definitions.ClientToServerEvent<[amount: 1 | 2 | 3, eggName: EggNames, isVoid: boolean]>();
export type RequestHatchDefinition = typeof requestHatchDefinition;
