import { Admin_KickPlayerDefinition } from "shared/remotes/admin/kickPlayer";
import { Admin_ModifyCurrencyDefinition } from "shared/remotes/admin/modifyCurrency";
import { Admin_ModifyPetLevelDefinition } from "shared/remotes/admin/modifyPetLevel";
import { Admin_ModifyRankDefinition } from "shared/remotes/admin/modifyRank";
import { Admin_ModifyTalismanLevelDefinition } from "shared/remotes/admin/modifyTalismanLevel";
import { Admin_ModifyWeaponLevelDefinition } from "shared/remotes/admin/modifyWeaponLevel";
import { Admin_ShutDownDefinition } from "shared/remotes/admin/shutdownServer";
import { Admin_SpawnPetDefinition } from "shared/remotes/admin/spawnPet";

import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 *  This is the remote context for the admin remote functions.
 */
export const adminRemoteContext = {
	admin_SpawnPet: fakeRemoteCall<Admin_SpawnPetDefinition>("admin_SpawnPet"),
	admin_ModifyPetLevel: fakeRemoteCall<Admin_ModifyPetLevelDefinition>("admin_ModifyPetLevel"),
	admin_ModifyWeaponLevel: fakeRemoteCall<Admin_ModifyWeaponLevelDefinition>("admin_ModifyWeaponLevel"),
	admin_ModifyTalismanLevel: fakeRemoteCall<Admin_ModifyTalismanLevelDefinition>("admin_ModifyTalismanLevel"),
	admin_ModifyRank: fakeRemoteCall<Admin_ModifyRankDefinition>("admin_ModifyRank"),
	admin_ModifyCurrency: fakeRemoteCall<Admin_ModifyCurrencyDefinition>("admin_ModifyCurrency"),
	admin_ShutdownServer: fakeRemoteCall<Admin_ShutDownDefinition>("admin_ShutdownServer"),
	admin_KickPlayer: fakeRemoteCall<Admin_KickPlayerDefinition>("admin_KickPlayer"),
};
