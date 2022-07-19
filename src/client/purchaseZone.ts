import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { PurchaseZoneDefinition } from "shared/remotes/purchaseZone";
import { CurrenciesState } from "shared/rodux/currencies";
import { WorldsState } from "shared/rodux/worlds";
import { canPurchaseZone } from "shared/util/canPurchaseZone";

/**
 * Handles the purchasing of the zone.
 *
 * @param worlds The Player's worlds state.
 * @param currencies The Player's currencies state.
 * @param worldName The name of the world the zone belongs to.
 * @param zoneName The name of the zone to purchase.
 * @param purchaseZoneRemote The purchase zone remote.
 */
export function purchaseZone(
	worlds: WorldsState,
	currencies: CurrenciesState,
	worldName: WorldName,
	zoneName: ZoneNames,
	purchaseZoneRemote: InferClientRemote<PurchaseZoneDefinition>,
): void {
	// Checks if the player can purchase the zone.
	if (!canPurchaseZone(worlds, currencies, worldName, zoneName)) {
		return;
	}

	// send to server to request purchase of zone
	purchaseZoneRemote.SendToServer(worldName, zoneName);
}
