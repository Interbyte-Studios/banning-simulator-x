import { remotes } from "shared/remotes";

import { withPlayerStore } from "./modules/net/withPlayerStore";
import { equipWeapon } from "./modules/rodux/equipWeapon";

remotes.Server.Create("equipWeapon").Connect(withPlayerStore((_, store, weaponId) => equipWeapon(store, weaponId)));
