debug.setmemorycategory("deletePetTeam");
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { deletePetTeam } from "shared/rodux/petTeams";

remotes.Server.GetNamespace("pets")
	.Get("deletePetTeam")
	.Connect(
		withPlayerStore((_, store, teamId) => {
			const currentState = store.getState();

			// verify they own the team
			const petTeam = currentState.petTeams.teams.find((team) => team.id === teamId);
			if (petTeam === undefined) {
				return;
			}

			// delete the team
			store.dispatch(deletePetTeam(teamId));
		}),
	);
