import Net from "@rbxts/net";
import { ProfileState } from "server/modules/datastore/profile";

export const storeStateCreatedDefinition =
	Net.Definitions.ServerToClientEvent<[player: Player, serializedState: ProfileState]>();
