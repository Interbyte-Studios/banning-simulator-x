import { Players } from "@rbxts/services";
import { onStoreCreated } from "server/playerStore";

Players.PlayerAdded.Connect((player) => {
	const store = onStoreCreated(player);
});
