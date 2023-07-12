import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";
import { StoreState } from "shared/rodux";
export type RequestStoreStateReturnType = { state: StoreState } | undefined;

export const requestStoreStateDefinition = Net.Definitions.ServerAsyncFunction<
	(player: Player) => RequestStoreStateReturnType
>([createTypeChecker(t.instanceIsA("Player"))]);
export type RequestStoreStateDefinition = typeof requestStoreStateDefinition;
