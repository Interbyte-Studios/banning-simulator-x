import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { lockPets } from "shared/rodux/pets";

remotes.Server.GetNamespace("pets")
	.Create("lockPets")
	.Connect(
		withPlayerStore((_, store, pets) => {
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

			// equip the pets
			store.dispatch(lockPets(petsToEquip));
		}),
	);
