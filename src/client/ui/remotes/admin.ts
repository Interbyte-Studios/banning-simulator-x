import { remotes } from "shared/remotes";

const remoteNamespace = remotes.Client.GetNamespace("admin");

/**
 * Remotes for admin.
 */
export const adminRemotes = {
	admin_SpawnPet: remoteNamespace.Get("admin_SpawnPet"),
	admin_ModifyPetLevel: remoteNamespace.Get("admin_ModifyPetLevel"),
	admin_ModifyWeaponLevel: remoteNamespace.Get("admin_ModifyWeaponLevel"),
	admin_ModifyTalismanLevel: remoteNamespace.Get("admin_ModifyTalismanLevel"),
	admin_ModifyRank: remoteNamespace.Get("admin_ModifyRank"),
	admin_ModifyCurrency: remoteNamespace.Get("admin_ModifyCurrency"),
	admin_ShutdownServer: remoteNamespace.Get("admin_ShutdownServer"),
	admin_KickPlayer: remoteNamespace.Get("admin_KickPlayer"),
};
