import { Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { setClickToFightEnabled } from "client/modules/clickToFightCache";

const player = Players.LocalPlayer;
onStoreCreated(player)
	.andThen((store) => {
		const currentState = store.getState();
		if (!currentState.settings.gameplay.manualFighting) {
			setClickToFightEnabled(false);
		}

		store.changed.connect((newState, oldState) => {
			if (newState.settings !== oldState.settings) {
				setClickToFightEnabled(newState.settings.gameplay.manualFighting);
			}
		});
	})
	.catch((e) => {
		throw `Failed to create store: ${e}`;
	});
