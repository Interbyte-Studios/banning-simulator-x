import { HttpService, Players } from "@rbxts/services";
import { modifyPetCount } from "server/modules/datastore/pets";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { PET_QUEST_PET_ID } from "shared/configs/game";
import { remotes } from "shared/remotes";
import { claimPetFromQuest } from "shared/rodux/petQuest";
import { addPets } from "shared/rodux/pets";

remotes.Server.Get("claimPetQuest").Connect(
	withPlayerStore((player, store) => {
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
	}),
);

Players.PlayerAdded.Connect((player) => {
	player.SetAttribute("petQuestBan", 0);
	player.SetAttribute("petQuestTime", 0);

	task.spawn(() => {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			task.wait(1);
			const timePlayed = (player.GetAttribute("petQuestTime") as number) + 1 ?? 0;
			player.SetAttribute("petQuestTime", timePlayed ?? 0);
		}
	});
});

for (const player of Players.GetPlayers()) {
	player.SetAttribute("petQuestBan", 0);
	player.SetAttribute("petQuestTime", 0);

	task.spawn(() => {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			task.wait(1);
			const timePlayed = (player.GetAttribute("petQuestTime") as number) + 1 ?? 0;
			player.SetAttribute("petQuestTime", timePlayed ?? 0);
		}
	});
}
