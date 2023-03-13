import Net from "@rbxts/net";
import { TalismanPhases } from "shared/configs/talismans";

export const admin_ModifyTalismanLevelDefinition = Net.Definitions.ClientToServerEvent<
	[
		targetPlayerId: number,
		talismanData: {
			talismanId: number;
			phase: TalismanPhases;
		},
	]
>([]);
export type Admin_ModifyTalismanLevelDefinition = typeof admin_ModifyTalismanLevelDefinition;
