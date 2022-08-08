import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { PurchaseTalismanDefinition } from "shared/remotes/talismans/purchaseTalisman";
import { Store } from "shared/rodux";
import { getTalismanData } from "shared/util/getTalismanData";

/**.
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
	const talismanData = getTalismanData(talismanId);

	if (store.getState().talismans.has(talismanId)) {
		warn(`Already owns talisman ${talismanData.name} of id ${talismanId}`);
		return;
	}

	if (store.getState().currencies[talismanData.cost.currency] < talismanData.cost.amount) {
		warn(`Not enough ${talismanData.cost.currency} to purchase talisman ${talismanData.name}`);
		return;
	}

	purchaseTalismanRemote.SendToServer(talismanId);
}
