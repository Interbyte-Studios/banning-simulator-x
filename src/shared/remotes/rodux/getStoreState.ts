import Net from "@rbxts/net";
import { StoreState } from "shared/rodux";

export const getStoreStateDefinition = Net.Definitions.ServerAsyncFunction<(player: Player) => Promise<StoreState>>();
