debug.setmemorycategory("limitedPets");
import { GameAnalytics } from "@rbxts/gameanalytics";
import { Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { animateSingleEggHatch, animateTripleEggHatch } from "client/modules/eggs/hatchEgg";
import { remotes } from "shared/remotes";

const marketplaceRemotes = remotes.Client.GetNamespace("eggs");
const hatchSingleExclusivePet = marketplaceRemotes.Get("hatchSingleExclusiveEgg");
const hatchTripleExclusivePet = marketplaceRemotes.Get("hatchTripleExclusiveEgg");

const player = Players.LocalPlayer;
onStoreCreated(player)
	.andThen((store) => {
		hatchSingleExclusivePet.Connect((eggName, petId) => {
			animateSingleEggHatch(eggName, petId, false, false, store.getState().gamepasses["Fast Hatch"]);
		});

		hatchTripleExclusivePet.Connect((eggName, petIds) => {
			animateTripleEggHatch(
				eggName,
				false,
				petIds.map((petId) => {
					return {
						id: petId,
						variant: "regular",
						method: "purchase",
						tradeLocked: false,
						autoDeleted: false,
						guid: "exclusive pet",
					};
				}),
				store.getState().gamepasses["Fast Hatch"],
			);
		});
	})
	.catch((e) => {
		// do not include player names. against the rules apparently.
		GameAnalytics.addErrorEvent(Players.LocalPlayer.UserId, {
			severity: "error",
			message: `[ Limited Pets Handler ] - Failed to run promise callback on "onStoreCreated" | ${e}`,
		});
		throw `[ Limited Pets ] - Failed to run promise callback on "onStoreCreated" for ${player.Name} | ${e}`;
	});
