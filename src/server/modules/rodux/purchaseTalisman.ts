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

	const storedTalisman = currentState.talismans.find((talisman) => talisman.id === talismanId);
	if (storedTalisman !== undefined) {
		return;
	}

	const previousTalismanId = talismanId - 1;
	if (previousTalismanId > 0) {
		const storedPreviousTalisman = currentState.talismans.find((talisman) => talisman.id === previousTalismanId);
		if (storedPreviousTalisman === undefined) {
			return;
		}
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
		store.dispatch(toggleWalkSpeed(24 + talismanEquipped));
	}
}
