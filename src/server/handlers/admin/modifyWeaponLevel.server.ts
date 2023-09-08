import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { retrieveStore } from "server/playerStore";
import { MODERATOR_RANK } from "shared/configs/admin";
import { remotes } from "shared/remotes";
import { admin_ModifyWeaponLevel } from "shared/rodux/weapons";

remotes.Server.GetNamespace("admin")
	.Get("admin_ModifyWeaponLevel")
	.Connect(
		withPlayerStore((adminPlayer, store, targetPlayerId, weaponData) => {
			const groupRank = store.getState().index.groupRank;
			if (groupRank < MODERATOR_RANK) {
				return;
			}

			const targetPlayer = game.GetService("Players").GetPlayerByUserId(targetPlayerId);
			if (targetPlayer === undefined) return;

			const targetPlayerStore = retrieveStore(targetPlayer);
			if (targetPlayerStore === undefined) return;

			const ownsWeapon = targetPlayerStore.getState().weapons.find((weapon) => weapon.id === weaponData.weaponId);
			if (ownsWeapon === undefined) return;

			targetPlayerStore.dispatch(admin_ModifyWeaponLevel(weaponData.weaponId, weaponData.level));
		}),
	);
