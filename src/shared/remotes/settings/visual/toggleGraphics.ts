import Net from "@rbxts/net";
import { ValidGraphicsQuality } from "shared/rodux/settings";

export const toggleGraphicsDefinition = Net.Definitions.ClientToServerEvent<[quality: ValidGraphicsQuality]>();
export type ToggleGraphicsDefinition = typeof toggleGraphicsDefinition;
