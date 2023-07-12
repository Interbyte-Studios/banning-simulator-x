import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";
import { isTalismanPhase, TalismanPhases } from "shared/configs/talismans";

export const admin_ModifyTalismanLevelDefinition = Net.Definitions.ClientToServerEvent<
	[
		targetPlayerId: number,
		talismanData: {
			talismanId: number;
			phase: TalismanPhases;
		},
	]
>([createTypeChecker(t.number, t.strictInterface({ talismanId: t.number, phase: isTalismanPhase }))]);
export type Admin_ModifyTalismanLevelDefinition = typeof admin_ModifyTalismanLevelDefinition;
