import { Store } from "shared/rodux";
import { equipAura as dispatchEquipAura } from "shared/rodux/currentAura";

/**
 * Equips an aura for a player.
 *
 * ### Errors
 * Errors if the store does not own the aura.
 *
 * @param store The store to equip the aura for.
 * @param auraId The ID of the aura to equip.
 */
export function equipAura(store: Store, auraId: number): void {
	// check player owns weapon
	if (!store.getState().auras.has(auraId)) {
		throw `${store} did not own weapon ${auraId}`;
	}

	// equip weapon
	store.dispatch(dispatchEquipAura(auraId));
}
