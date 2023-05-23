import Net from "@rbxts/net";

export const sendTradeRequestDefinition = Net.Definitions.ServerToClientEvent<[playerWhoSent: Player]>();
export type SendTradeRequestDefinition = typeof sendTradeRequestDefinition;
