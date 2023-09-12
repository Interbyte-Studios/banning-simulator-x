import { Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { animateEggHatch } from "client/modules/eggs/hatchEgg";
import { isExclusiveEgg } from "shared/configs/eggs";
import { remotes } from "shared/remotes";

const eggNamespace = remotes.Client.GetNamespace("eggs");
const conveyHatch = eggNamespace.Get("conveyHatch");

const player = Players.LocalPlayer;
onStoreCreated(player)
	.andThen((store) => {
		conveyHatch.Connect((eggName, pets, isVoid) => {
			const isExclusive = isExclusiveEgg(eggName);
			animateEggHatch(
				eggName,
				isVoid,
				pets,
				isExclusive ? false : store.getState().gamepasses["Fast Hatch"],
				isExclusive ? false : store.getState().rebirths.fastHatch,
			);
		});
	})
	.catch((e) => {
		throw `Failed to find store for ${player.Name}. ConveyHatch handler won't run. Error: ${e}`;
	});
