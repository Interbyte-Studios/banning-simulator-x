import { Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { setAmountOfPets } from "client/modules/uiNotifications/petsModule";

const player = Players.LocalPlayer;
onStoreCreated(player)
	.andThen((store) => {
		const currentState = store.getState();
		setAmountOfPets(currentState.pets.size());
	})
	.catch((e) => {
		throw `Failed to create store for player ${player.Name} with error: ${e}`;
	});
