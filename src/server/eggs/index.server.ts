import { remotes } from "shared/remotes";

export const requestHatch = remotes.Server.GetNamespace("eggs").Create("requestHatch");
export const relayHatch = remotes.Server.GetNamespace("eggs").Create("relayHatch");

requestHatch.Connect((player, eggName, isVoid) => {
	relayHatch.SendToPlayer(player, eggName, [], isVoid);
});
