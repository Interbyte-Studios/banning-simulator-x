import { GameAnalytics } from "@rbxts/gameanalytics";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { retrieveStore } from "server/playerStore";
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

			const targetPlayerStore = retrieveStore(targetPlayer);
			if (targetPlayerStore === undefined) return;

			const ownsPet = targetPlayerStore.getState().pets.find((pet) => pet.guid === petData.petGuid);
			if (ownsPet === undefined) return;

			GameAnalytics.addErrorEvent(adminPlayer.UserId, {
				severity: "warning",
				message:
					targetPlayer.UserId === adminPlayer.UserId
						? `Modified pet level self | Pet: ${ownsPet.id} | Level: ${petData.level}`
						: `Modified pet level for user with id: ${targetPlayer.UserId} | Pet: ${ownsPet.id} | Level: ${petData.level}`,
			});
			targetPlayerStore.dispatch(admin_ModifyPetLevel(ownsPet.guid, ownsPet.id, ownsPet.variant, petData.level));
		}),
	);
