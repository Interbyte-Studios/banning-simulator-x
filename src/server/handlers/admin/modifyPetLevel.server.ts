
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { retrieveStore } from "server/playerStore";
import { MODERATOR_RANK } from "shared/configs/admin";
import { remotes } from "shared/remotes";
import { admin_ModifyPetLevel } from "shared/rodux/pets";
import { logPetMaxLevel } from "shared/rodux/playerIndex/pets";

remotes.Server.GetNamespace("admin")
	.Get("admin_ModifyPetLevel")
	.Connect(
		withPlayerStore((adminPlayer, store, targetPlayerId, petData) => {
			const groupRank = store.getState().index.groupRank;
			if (groupRank < MODERATOR_RANK) {
				return;
			}

			const targetPlayer = game.GetService("Players").GetPlayerByUserId(targetPlayerId);
			if (targetPlayer === undefined) return;

			const targetPlayerStore = retrieveStore(targetPlayer);
			if (targetPlayerStore === undefined) return;

			const ownsPet = targetPlayerStore.getState().pets.find((pet) => pet.guid === petData.petGuid);
			if (ownsPet === undefined) return;

			targetPlayerStore.dispatch(admin_ModifyPetLevel(ownsPet.guid, ownsPet.id, ownsPet.variant, petData.level));
			targetPlayerStore.dispatch(logPetMaxLevel([{ id: ownsPet.id, variant: ownsPet.variant }]));
		}),
	);
