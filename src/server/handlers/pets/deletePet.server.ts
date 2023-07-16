import { modifyPetCount } from "server/modules/datastore/pets";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { deletePets } from "shared/rodux/pets";
import { getPetData } from "shared/util/getPetData";

remotes.Server.GetNamespace("pets")
	.Get("deletePets")
	.Connect(
		withPlayerStore((_, store, pets) => {
			const currentState = store.getState();

			const petsToDelete: Array<string> = [];
			for (const petToDelete of pets) {
				const storedPet = currentState.pets.find((pet) => pet.guid === petToDelete);
				if (storedPet === undefined) {
					warn(`Could not delete pet with guid of ${petToDelete} because the player doesn't own it.`);
					continue;
				}

				if (storedPet.locked) {
					continue;
				}

				if (storedPet.equipped) {
					continue;
				}

				const petData = getPetData(storedPet.id);
				if (petData.rarity === "Prismatic" || petData.rarity === "Primordial") {
					continue;
				}

				modifyPetCount({
					type: "deletePet",
					petId: storedPet.id,
					variant: storedPet.variant,
					amount: 1,
				});

				petsToDelete.push(petToDelete);
			}

			store.dispatch(deletePets(petsToDelete));
		}),
	);
