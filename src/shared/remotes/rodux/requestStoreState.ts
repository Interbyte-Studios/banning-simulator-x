import Net from "@rbxts/net";
import { StoreState } from "shared/rodux";
export type RequestStoreStateReturnType = { state: StoreState } | undefined;

export const requestStoreStateDefinition = Net.Definitions.ServerAsyncFunction<
	(player: Player) => RequestStoreStateReturnType
>([]);
export type RequestStoreStateDefinition = typeof requestStoreStateDefinition;
