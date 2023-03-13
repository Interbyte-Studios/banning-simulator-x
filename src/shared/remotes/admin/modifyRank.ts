import Net from "@rbxts/net";

export const admin_ModifyRankDefinition = Net.Definitions.ClientToServerEvent<[targetPlayerId: number, rank: number]>(
	[],
);
export type Admin_ModifyRankDefinition = typeof admin_ModifyRankDefinition;
