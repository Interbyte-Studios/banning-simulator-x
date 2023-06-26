import { GameAnalytics } from "@rbxts/gameanalytics";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { retrieveStore } from "server/playerStore";
import { ADMIN_RANK } from "shared/configs/admin";
import { GROUP_ID } from "shared/configs/game";
import { remotes } from "shared/remotes";
import { admin_ModifyWeaponLevel } from "shared/rodux/weapons";

remotes.Server.GetNamespace("admin")
	.Create("admin_ModifyWeaponLevel")
	.Connect(
		withPlayerStore((adminPlayer, store, targetPlayerId, weaponData) => {
			const isAdminRank = adminPlayer.GetRankInGroup(GROUP_ID) >= ADMIN_RANK;
			if (!isAdminRank) return;

			const targetPlayer = game.GetService("Players").GetPlayerByUserId(targetPlayerId);
			if (targetPlayer === undefined) return;

			const targetPlayerStore = retrieveStore(targetPlayer);
			if (targetPlayerStore === undefined) return;

			const ownsWeapon = targetPlayerStore.getState().weapons.find((weapon) => weapon.id === weaponData.weaponId);
			if (ownsWeapon === undefined) return;

			GameAnalytics.addErrorEvent(adminPlayer.UserId, {
				severity: "warning",
				message:
					targetPlayer.UserId === adminPlayer.UserId
						? `Modified weapon level self | Weapon: ${ownsWeapon.id} | Level: ${weaponData.level}`
						: `Modified weapon level for user with id: ${targetPlayer.UserId} | Weapon: ${ownsWeapon.id} | Level: ${weaponData.level}`,
			});
			targetPlayerStore.dispatch(admin_ModifyWeaponLevel(weaponData.weaponId, weaponData.level));
		}),
	);
