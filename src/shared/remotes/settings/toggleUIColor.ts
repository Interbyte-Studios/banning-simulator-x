import Net from "@rbxts/net";
import { ValidUIColor } from "shared/rodux/settings";

export const toggleUIColorDefinition = Net.Definitions.ClientToServerEvent<[color: ValidUIColor]>();
export type ToggleUIColorDefinition = typeof toggleUIColorDefinition;
