import { HttpService, Players, RunService } from "@rbxts/services";
import { modifyPetCount } from "server/modules/datastore/pets";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { PET_QUEST_PET_ID } from "shared/configs/game";
import { remotes } from "shared/remotes";
import { Store } from "shared/rodux";
import { claimPetFromQuest } from "shared/rodux/petQuest";
import { addPets } from "shared/rodux/pets";

const claimPetQuestRemote = remotes.Server.Get("claimPetQuest");

/**
 * @param player The player!
 */
function handlePlayer(player: Player): void {
	let lastCheck = 0;
	const connection = RunService.Heartbeat.Connect(() => {
		// only run the code once per second!
		const now = time();
		if (now - lastCheck < 1) {
			return;
		}
		lastCheck = now;

		// check that they're still in the game!
		if (!player.IsDescendantOf(Players)) {
			connection.Disconnect();
			return;
		}

		// Booya!
		const timePlayed = player.GetAttribute("petQuestTime") as number | undefined;
		player.SetAttribute("petQuestTime", timePlayed !== undefined ? timePlayed + 1 : 0);
	});
}

/**
 * @param player The player!
 * @param store The player's store.
 */
function claimPetQuest(player: Player, store: Store): void {
	const currentState = store.getState();
	if (currentState.petQuests.includes(PET_QUEST_PET_ID)) {
		return;
	}

	const petQuestBanProgress = (player.GetAttribute("petQuestBan") as number) ?? 0;
	if (petQuestBanProgress < 250) {
		return;
	}

	const petQuestTimeProgress = (player.GetAttribute("petQuestTime") as number) ?? 0;
	if (petQuestTimeProgress < 3600) {
		return;
	}

	store.dispatch(claimPetFromQuest(PET_QUEST_PET_ID));
	store.dispatch(
		addPets([
			{
				id: PET_QUEST_PET_ID,
				variant: "regular",
				tradeLocked: false,
				guid: HttpService.GenerateGUID(false),
			},
		]),
	);

	modifyPetCount({
		type: "addPet",
		petId: PET_QUEST_PET_ID,
		variant: "regular",
	});
}

/**
 * Attempt to claim the current quest available through the pet quest.
 */
claimPetQuestRemote.Connect(withPlayerStore((player, store) => claimPetQuest(player, store)));

/**
 * Run `handlePlayer` for player's who've already joined the game.
 */
Players.GetPlayers().forEach(handlePlayer);

/**
 * Run `handlePlayer` for new players.
 */
Players.PlayerAdded.Connect(handlePlayer);
