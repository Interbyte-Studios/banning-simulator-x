import { remotes } from "shared/remotes";

import { withPlayerStore } from "./modules/net/withPlayerStore";
import { purchaseWeapon } from "./modules/rodux/purchaseWeapon";

const purchaseWeaponEvent = remotes.Server.GetNamespace("weapons").Create("purchaseWeapon");
purchaseWeaponEvent.SetCallback(withPlayerStore((_, store, weaponId) => purchaseWeapon(store, weaponId)));
