import { GameAnalytics } from "@rbxts/gameanalytics";
import { HttpService } from "@rbxts/services";
import { modifyPetCount } from "server/modules/datastore/pets";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { retrieveStore } from "server/playerStore";
import { ADMIN_RANK } from "shared/configs/admin";
import { Currency } from "shared/configs/currencies";
import { remotes } from "shared/remotes";
import { addPets, ConfirmedPet } from "shared/rodux/pets";
import { getEggNameFromPetId } from "shared/util/getEggFromPetId";
import { getPetData } from "shared/util/getPetData";

remotes.Server.GetNamespace("admin")
	.Get("admin_SpawnPet")
	.Connect(
		withPlayerStore((adminPlayer, store, targetPlayerId, petData) => {
			const groupRank = store.getState().index.groupRank;
			if (groupRank === undefined || groupRank < ADMIN_RANK) {
				return;
			}

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
				id: petData.petId,
				guid: HttpService.GenerateGUID(false),
				variant: petData.variant,
				method: "admin",
				//enhancements: {},
				tradeLocked: groupRank !== 254,
			};

			GameAnalytics.addErrorEvent(adminPlayer.UserId, {
				severity: "warning",
				message:
					targetPlayer.UserId === adminPlayer.UserId
						? `${adminPlayer.Name} spawned pet | Pet: ${pet.id} | Variant: ${pet.variant}`
						: `${adminPlayer.Name} spawned pet for user with id: ${targetPlayer.UserId} | Pet: ${pet.id} | Variant: ${pet.variant}`,
			});
			modifyPetCount({
				type: "addPet",
				petId: petData.petId,
				variant: petData.variant,
			});
			targetPlayerStore.dispatch(addPets(cost, currency, [pet]));
		}),
	);
