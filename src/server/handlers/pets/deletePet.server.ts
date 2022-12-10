import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { deletePets } from "shared/rodux/pets";

remotes.Server.GetNamespace("pets")
	.Create("deletePets")
	.Connect(
		withPlayerStore((_, store, pets) => {
			const currentState = store.getState();

			const petsToDelete: Array<string> = [];
			for (const petToDelete of pets) {
				print(currentState.pets);
				print(pets);
				if (currentState.pets.find((pet) => pet.guid === petToDelete) === undefined) {
					warn(`Could not delete pet with guid of ${petToDelete} because the player doesn't own it.`);
					continue;
				}

				petsToDelete.push(petToDelete);
			}

			store.dispatch(deletePets(petsToDelete));
		}),
	);
