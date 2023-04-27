import Net from "@rbxts/net";
import { StoreState } from "shared/rodux";

export const storeStateCreatedDefinition = Net.Definitions.ServerToClientEvent<[player: Player, store: StoreState]>();
