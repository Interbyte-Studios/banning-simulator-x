import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const lockPetsDefinition = Net.Definitions.ClientToServerEvent<
	[pets: Array<{ guid: string; enabled: boolean }>]
>([createTypeChecker(t.array(t.strictInterface({ guid: t.string, enabled: t.boolean })))]);
export type LockPetsDefinition = typeof lockPetsDefinition;
