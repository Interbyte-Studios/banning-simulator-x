import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { Store } from "shared/rodux";
import { unlockZone } from "shared/rodux/worlds";
import { canPurchaseZone } from "shared/util/canPurchaseZone";
import { getZoneData } from "shared/util/getZoneData";

/**
 * Purchases a zone for a player.
 *
 * @param store The store to buy the zone for.
 * @param worldName The name of the world.
 * @param zoneName The name of the zone that player purchases.
 */
export function purchaseZone(store: Store, worldName: WorldName, zoneName: ZoneNames): void {
	const zoneData = getZoneData(worldName, zoneName);
	if (zoneData.cost === undefined) {
		return;
	}

	const canPurchase = canPurchaseZone(store.getState().worlds, store.getState().currencies, worldName, zoneName);
	if (!canPurchase) {
		return;
	}

	store.dispatch(
		unlockZone({
			zoneName: zoneName,
			worldName: worldName,
			currency: {
				amount: zoneData.cost.amount,
				type: zoneData.cost.currency,
			},
		}),
	);
}
