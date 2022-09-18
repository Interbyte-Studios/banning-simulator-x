import { Store } from "shared/rodux";
import { purchaseTalisman as dispatchPurchaseTalisman } from "shared/rodux/talismans";
import { getTalismanData } from "shared/util/getTalismanData";

/**
 * Purchases a talisman for the player.
 *
 * @param store The store to purchase the talisman for.
 * @param talismanId The id of the talisman being purchased.
 */
export function purchaseTalisman(store: Store, talismanId: number): void {
	if (talismanId - 1 > 0) {
		const ownsPreviousTalisman = store.getState().talismans.has(talismanId - 1);
		if (!ownsPreviousTalisman) {
			return;
		}
	}

	if (store.getState().talismans.has(talismanId)) {
		return;
	}

	const talismanData = getTalismanData(talismanId);

	if (store.getState().currencies[talismanData.cost.currency] < talismanData.cost.amount) {
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
}
