import Net from "@rbxts/net";
import { StoreActions } from "shared/rodux";

export const storeChangeDefinition = Net.Definitions.ServerToClientEvent<[player: Player, action: StoreActions]>();
