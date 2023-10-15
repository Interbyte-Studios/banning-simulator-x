debug.setmemorycategory("changePetTeamName");
import { TextService } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { updateTeamName } from "shared/rodux/petTeams";

const MAX_TEAM_LENGTH = 50;

remotes.Server.GetNamespace("pets")
	.Get("changePetTeamName")
	.Connect(
		withPlayerStore((player, store, teamId, newName) => {
			const currentState = store.getState();

			// ensure team name is serializable
			const nameLength = utf8.len(newName)[0];
			if (!(typeIs(nameLength, "number") && nameLength < MAX_TEAM_LENGTH)) {
				return;
			}

			// find the team they're modifying
			const storedTeam = currentState.petTeams.teams.find((team) => team.id === teamId);
			if (storedTeam === undefined) {
				return;
			}

			if (newName.size() > 30) {
				return;
			}

			if (utf8.len(newName) === undefined) {
				return;
			}

			// filter text
			const [filterText, result] = pcall(() => {
				return TextService.FilterStringAsync(newName, player.UserId);
			});

			if (filterText) {
				const filteredText = result.GetNonChatStringForUserAsync(player.UserId);
				store.dispatch(updateTeamName(teamId, filteredText));
			} else warn(`Failed to filter text sent by player: ${player.Name} when changing team name.`);
		}),
	);
