import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { PurchaseTalismanDefinition } from "shared/remotes/talismans/purchaseTalisman";
import { Store } from "shared/rodux";
import { getTalismanData } from "shared/util/getTalismanData";

/**
 *
 * @param store The store of the player.
 * @param talismanId The id of the talisman that will be purchased.
 * @param purchaseTalismanRemote The remote used for the purchase.
 */
export function purchaseTalisman(
	store: Store,
	talismanId: number,
	purchaseTalismanRemote: InferClientRemote<PurchaseTalismanDefinition>,
): void {
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

	purchaseTalismanRemote.SendToServer(talismanId);
}
