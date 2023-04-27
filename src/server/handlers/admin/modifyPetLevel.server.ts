import { dataClass } from "server/classes/dataClass";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { ADMIN_RANK } from "shared/configs/admin";
import { GROUP_ID } from "shared/configs/game";
import { remotes } from "shared/remotes";
import { admin_ModifyPetLevel } from "shared/rodux/pets";

remotes.Server.GetNamespace("admin")
	.Create("admin_ModifyPetLevel")
	.Connect(
		withPlayerStore((adminPlayer, store, targetPlayerId, petData) => {
			const isAdminRank = adminPlayer.GetRankInGroup(GROUP_ID) >= ADMIN_RANK;
			if (!isAdminRank) return;

			const targetPlayer = game.GetService("Players").GetPlayerByUserId(targetPlayerId);
			if (targetPlayer === undefined) return;

			const targetPlayerStore = dataClass.retrieveStore(targetPlayer);
			if (targetPlayerStore === undefined) return;

			const ownsPet = targetPlayerStore.getState().pets.find((pet) => pet.guid === petData.petGuid);
			if (ownsPet === undefined) return;

			targetPlayerStore.dispatch(admin_ModifyPetLevel(ownsPet.guid, ownsPet.id, ownsPet.variant, petData.level));
		}),
	);
