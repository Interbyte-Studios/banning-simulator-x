import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { createPetTeam } from "shared/rodux/petTeams";

remotes.Server.GetNamespace("pets")
	.Get("createPetTeam")
	.Connect(
		withPlayerStore((_, store, pets) => {
			const currentState = store.getState();

			// verify that they have space to create another team
			if (currentState.petTeams.teams.size() >= currentState.petTeams.maxTeams) {
				return;
			}

			// verify that they own all the pets
			const ownedPets: Array<string> = [];
			for (const pet of pets) {
				const storedPet = currentState.pets.find((p) => p.guid === pet);
				if (storedPet === undefined) {
					continue;
				}

				ownedPets.push(storedPet.guid);
			}

			// create the team
			store.dispatch(createPetTeam(ownedPets));
		}),
	);
