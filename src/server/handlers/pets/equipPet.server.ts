debug.setmemorycategory("equipPet");
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { equipPets } from "shared/rodux/pets";
import { getMaxPetEquip } from "shared/util/getMaxPetEquip";

remotes.Server.GetNamespace("pets")
	.Get("equipPets")
	.Connect(
		withPlayerStore((player, store, pets, unequipAll) => {
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

			const maxPetEquip = getMaxPetEquip(player, currentState.gamepasses, currentState.rebirths);

			const currentlyEquippedPets = currentState.pets.filter(
				(pet) => pet.equipped && !petsToEquip.find((newPet) => newPet.guid === pet.guid),
			);
			const newlyEquippedPets = petsToEquip.filter((pet) => pet.enabled);
			if (unequipAll) {
				if (newlyEquippedPets.size() > maxPetEquip) {
					return;
				}
			} else {
				if (currentlyEquippedPets.size() + newlyEquippedPets.size() > maxPetEquip) {
					return;
				}
			}

			store.dispatch(equipPets(petsToEquip, unequipAll));
		}),
	);
