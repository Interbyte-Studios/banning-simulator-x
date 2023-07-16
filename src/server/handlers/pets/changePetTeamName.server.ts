import { TextService } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { updateTeamName } from "shared/rodux/petTeams";

remotes.Server.GetNamespace("pets")
	.Create("changePetTeamName")
	.Connect(
		withPlayerStore((player, store, teamId, newName) => {
			const currentState = store.getState();

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
				task.spawn(() => {
					const filteredText = result.GetNonChatStringForUserAsync(player.UserId);

					store.dispatch(updateTeamName(teamId, filteredText));
				});
			} else warn(`Failed to filter text sent by player: ${player.Name} when changing team name.`);
		}),
	);
