import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { Store } from "shared/rodux";
import { unlockZone } from "shared/rodux/worlds";
import { getZoneData } from "shared/util/getZoneData";

/**
 * Purchases a zone for a player.
 *
 * @param store The store to buy the zone for.
 * @param worldName The name of the world.
 * @param zoneName The name of the zone that player purchases.
 */
export function purchaseZone(store: Store, worldName: WorldName, zoneName: ZoneNames): void {
	const worldData = store.getState().worlds.find((worldData) => worldData.name === worldName);
	const ownsZone = worldData?.zones.find((zone) => zone === zoneName) !== undefined;

	// check if player owns the zone
	if (ownsZone) {
		return;
	}

	// get zone data
	const zoneData = getZoneData(worldName, zoneName);

	// check to be sure the zone can be purchased
	if (zoneData.cost === undefined) {
		return;
	}

	// check to be sure player has enough currency to buy the zone
	if (store.getState().currencies[zoneData.cost.currency] < zoneData.cost.amount) {
		return;
	}

	// purchase zone
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
