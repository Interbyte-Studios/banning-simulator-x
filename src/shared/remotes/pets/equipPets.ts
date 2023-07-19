import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const equipPetsDefinition = Net.Definitions.ClientToServerEvent<
	[pets: Array<{ guid: string; enabled: boolean }>, unequipAll: boolean]
>([createTypeChecker(t.array(t.strictInterface({ guid: t.string, enabled: t.boolean })), t.boolean)]);
export type EquipPetsDefinition = typeof equipPetsDefinition;
