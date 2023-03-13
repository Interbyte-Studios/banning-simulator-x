import Net from "@rbxts/net";

import { admin_KickPlayerDefinition } from "./kickPlayer";
import { admin_ModifyCurrencyDefinition } from "./modifyCurrency";
import { admin_ModifyPetLevelDefinition } from "./modifyPetLevel";
import { admin_ModifyRankDefinition } from "./modifyRank";
import { admin_ModifyTalismanLevelDefinition } from "./modifyTalismanLevel";
import { admin_ModifyWeaponLevelDefinition } from "./modifyWeaponLevel";
import { admin_ShutDownDefinition } from "./shutdownServer";
import { admin_SpawnPetDefinition } from "./spawnPet";

export const admin = Net.Definitions.Namespace({
	admin_SpawnPet: admin_SpawnPetDefinition,
	admin_ModifyPetLevel: admin_ModifyPetLevelDefinition,
	admin_ModifyWeaponLevel: admin_ModifyWeaponLevelDefinition,
	admin_ModifyTalismanLevel: admin_ModifyTalismanLevelDefinition,
	admin_ModifyRank: admin_ModifyRankDefinition,
	admin_ModifyCurrency: admin_ModifyCurrencyDefinition,
	admin_ShutdownServer: admin_ShutDownDefinition,
	admin_KickPlayer: admin_KickPlayerDefinition,
});
