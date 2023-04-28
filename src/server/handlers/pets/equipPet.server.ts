import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { equipPets } from "shared/rodux/pets";
import { getMaxPetEquip } from "shared/util/getMaxPetEquip";

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

			// verify that they have space
			if (!unequipAll) {
				const currentAmountEquipped = petsToEquip.size();
				const maxEquipAmount = getMaxPetEquip(currentState.gamepasses);

				if (currentAmountEquipped >= maxEquipAmount) {
					return;
				}
			}

			// equip the pets
			store.dispatch(equipPets(petsToEquip, unequipAll));
		}),
	);
