import { Players } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { onStoreCreated } from "server/playerStore";
import { remotes } from "shared/remotes";
import { equipPets } from "shared/rodux/pets";
import { getMaxPetEquip } from "shared/util/getMaxPetEquip";

Players.PlayerAdded.Connect(async (player) => {
	const store = await onStoreCreated(player);

	if (
		store
			.getState()
			.pets.filter((pet) => pet.equipped)
			.size() > getMaxPetEquip(store.getState().gamepasses)
	) {
		store.dispatch(equipPets([], true));
	}
});

remotes.Server.GetNamespace("pets")
	.Create("equipPets")
	.Connect(
		withPlayerStore((_, store, pets, unequipAll) => {
			const currentState = store.getState();

			// verify that they own the pets
			const petsToEquip: Array<{ guid: string; enabled: boolean }> = [];
			for (const petToEquip of pets) {
				const storedPet = currentState.pets.find((pet) => pet.guid === petToEquip.guid);
				if (storedPet === undefined) {
					continue;
				}

				petsToEquip.push(petToEquip);
			}

			const currentlyEquippedPets = currentState.pets.filter(
				(pet) => pet.equipped && !petsToEquip.find((newPet) => newPet.guid === pet.guid),
			);
			const newlyEquippedPets = petsToEquip.filter((pet) => pet.enabled);
			if (unequipAll) {
				if (newlyEquippedPets.size() > getMaxPetEquip(currentState.gamepasses)) {
					return;
				}
			} else {
				if (currentlyEquippedPets.size() + newlyEquippedPets.size() > getMaxPetEquip(currentState.gamepasses)) {
					return;
				}
			}

			store.dispatch(equipPets(petsToEquip, unequipAll));
		}),
	);
