import { Store } from "shared/rodux";
import { equipTalisman as dispatchEquipTalisman } from "shared/rodux/currentTalisman";

/**
 * Equips a talisman for a player.
 *
 * Errors if the store does not own the talisman.
 *
 * @param store The store the talisman is equipped to.
 * @param talismanId The id of the talisman being equipped.
 */
export function equipTalisman(store: Store, talismanId: number): void {
	if (!store.getState().talismans.has(talismanId)) {
		throw `Expected ${store} to own talisman of id ${talismanId}`;
	}

	store.dispatch(dispatchEquipTalisman(talismanId));
}
