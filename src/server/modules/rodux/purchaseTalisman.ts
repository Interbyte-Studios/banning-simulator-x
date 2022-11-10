import { Store } from "shared/rodux";
import { toggleWalkSpeed } from "shared/rodux/settings";
import { purchaseTalisman as dispatchPurchaseTalisman } from "shared/rodux/talismans";
import { getTalismanData } from "shared/util/getTalismanData";

/**
 * Purchases a talisman for the player.
 *
 * @param store The store to purchase the talisman for.
 * @param talismanId The id of the talisman being purchased.
 */
export function purchaseTalisman(store: Store, talismanId: number): void {
	const currentState = store.getState();

	if (talismanId - 1 > 0) {
		const ownsPreviousTalisman = currentState.talismans.has(talismanId - 1);
		if (!ownsPreviousTalisman) {
			return;
		}
	}

	if (currentState.talismans.has(talismanId)) {
		return;
	}

	const talismanData = getTalismanData(talismanId);

	if (currentState.currencies[talismanData.cost.currency] < talismanData.cost.amount) {
		return;
	}

	store.dispatch(
		dispatchPurchaseTalisman({
			id: talismanData.id,
			cost: {
				currency: talismanData.cost.currency,
				amount: talismanData.cost.amount,
			},
		}),
	);

	const talismanEquipped = store.getState().currentTalisman;
	if (talismanEquipped !== undefined) {
		store.dispatch(toggleWalkSpeed(16 + talismanEquipped));
	}
}
