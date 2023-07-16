import { remotes } from "shared/remotes";

import { withPlayerStore } from "../../modules/net/withPlayerStore";
import { purchaseWeapon } from "../../modules/rodux/purchaseWeapon";

remotes.Server.GetNamespace("weapons")
	.Get("purchaseWeapon")
	.Connect(withPlayerStore((_, store, weaponId) => purchaseWeapon(store, weaponId)));
