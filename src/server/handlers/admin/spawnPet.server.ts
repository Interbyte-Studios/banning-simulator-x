import { GameAnalytics } from "@rbxts/gameanalytics";
import { HttpService } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { retrieveStore } from "server/playerStore";
import { ADMIN_RANK } from "shared/configs/admin";
import { Currency } from "shared/configs/currencies";
import { GROUP_ID } from "shared/configs/game";
import { remotes } from "shared/remotes";
import { addPets, ConfirmedPet } from "shared/rodux/pets";
import { getEggNameFromPetId } from "shared/util/getEggFromPetId";
import { getPetData } from "shared/util/getPetData";

remotes.Server.GetNamespace("admin")
	.Create("admin_SpawnPet")
	.Connect(
		withPlayerStore((adminPlayer, store, targetPlayerId, petData) => {
			const isAdminRank = adminPlayer.GetRankInGroup(GROUP_ID) >= ADMIN_RANK;
			if (!isAdminRank) return;

			const targetPlayer = game.GetService("Players").GetPlayerByUserId(targetPlayerId);
			if (targetPlayer === undefined) return;

			const targetPlayerStore = retrieveStore(targetPlayer);
			if (targetPlayerStore === undefined) return;

			const isValidPet = getPetData(petData.petId);
			if (!isValidPet) return;

			const eggName = getEggNameFromPetId(isValidPet.id);
			if (!eggName) return;

			const cost = 0;
			const currency: Currency = "coins";
			const pet: ConfirmedPet = {
				autoDeleted: false,
				id: isValidPet.id,
				guid: HttpService.GenerateGUID(false),
				variant: petData.variant,
				method: "admin",
				//enhancements: {},
				tradeLocked: true,
			};

			GameAnalytics.addErrorEvent(adminPlayer.UserId, {
				severity: "warning",
				message:
					targetPlayer.UserId === adminPlayer.UserId
						? `Spawned pet self | Pet: ${pet.id}`
						: `Spawned pet for user with id: ${targetPlayer.UserId} | Pet: ${pet.id}`,
			});
			targetPlayerStore.dispatch(addPets(cost, currency, [pet]));
		}),
	);
