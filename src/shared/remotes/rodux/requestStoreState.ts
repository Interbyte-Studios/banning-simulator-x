import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";
import { ProfileState } from "server/modules/datastore/profile";
export type RequestStoreStateReturnType = ProfileState | undefined;

export const requestStoreStateDefinition = Net.Definitions.ServerAsyncFunction<
	(player: Player) => RequestStoreStateReturnType
>([createTypeChecker(t.instanceIsA("Player"))]);
export type RequestStoreStateDefinition = typeof requestStoreStateDefinition;
