import { Store } from "shared/rodux";
import { equipTalisman as dispatchEquipTalisman } from "shared/rodux/currentTalisman";
import { toggleWalkSpeed } from "shared/rodux/settings";
import { getTalismanData } from "shared/util/getTalismanData";

/**
 * Equips a talisman for a player.
 *
 * Errors if the store does not own the talisman.
 *
 * @param store The store the talisman is equipped to.
 * @param talismanId The id of the talisman being equipped.
 */
export function equipTalisman(store: Store, talismanId: number): void {
	const currentState = store.getState();

	const storedTalisman = currentState.talismans.find((talisman) => talisman.id === talismanId);
	if (storedTalisman === undefined) {
		return;
	}

	const talismanData = getTalismanData(talismanId);
	if (talismanData === undefined) {
		warn(`Failed to fetch talisman data for talisman with id: "${talismanId}"`);
		return;
	}

	store.dispatch(dispatchEquipTalisman(talismanId));

	const currentTalisman = store.getState().currentTalisman;
	if (currentTalisman !== undefined) {
		store.dispatch(toggleWalkSpeed(24 + talismanData.stats.walkspeed));
	}
}
