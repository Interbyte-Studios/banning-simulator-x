import Net from "@rbxts/net";
import { EggNames } from "shared/configs/eggs";

export const requestHatchDefinition = Net.Definitions.ClientToServerEvent<[eggName: EggNames, isVoid: boolean]>();
export type RequestHatchDefinition = typeof requestHatchDefinition;
