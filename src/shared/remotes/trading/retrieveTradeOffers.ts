import Net from "@rbxts/net";

export const retrieveTradeOffersDefinition = Net.Definitions.ClientToServerEvent<[creator: Player, receiver: Player]>(
	[],
);
export type RetrieveTradeOffersDefinition = typeof retrieveTradeOffersDefinition;
