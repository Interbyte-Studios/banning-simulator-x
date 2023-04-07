import Net from "@rbxts/net";

export const sendTradeRequestDefinition = Net.Definitions.ServerToClientEvent<[]>();
export type SendTradeRequestDefinition = typeof sendTradeRequestDefinition;
