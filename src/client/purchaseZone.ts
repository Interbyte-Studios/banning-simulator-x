import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { PurchaseZoneDefinition } from "shared/remotes/purchaseZone";
import { Store } from "shared/rodux";
import { getZoneData } from "shared/util/getZoneData";
import { getZoneDataById } from "shared/util/getZoneDataById";

/**
 * Handles the purchasing of the zone.
 *
 * @param store The player's store.
 * @param worldName The name of the world the zone belongs to.
 * @param zoneName The name of the zone to purchase.
 * @param purchaseZoneRemote The purchase zone remote.
 */
export function purchaseZone(
	store: Store,
	worldName: WorldName,
	zoneName: ZoneNames,
	purchaseZoneRemote: InferClientRemote<PurchaseZoneDefinition>,
): void {
	const worldData = store.getState().worlds.find((world) => world.name === worldName);
	if (worldData === undefined) {
		return;
	}

	const doesOwnZone = worldData?.zones.find((zone) => zone === zoneName) !== undefined;
	if (doesOwnZone) {
		return;
	}

	// get zone data.
	const zoneData = getZoneData(worldName, zoneName);

	// get zone data for the previous zone.
	const previousZoneData = getZoneDataById(worldName, zoneData.id - 1);

	// check if its valid.
	if (!previousZoneData) {
		return;
	}

	// check if the player owns the previous zone.
	const ownsPreviousZone = worldData.zones.find((zone) => zone === previousZoneData.name) !== undefined;
	if (!ownsPreviousZone) {
		warn(`Expected player to own previous zone ${previousZoneData.name}`);
		return;
	}

	// check to be sure if the zone is for purchase.
	assert(zoneData.cost !== undefined, `Zone ${zoneName} of world ${worldName} was not purchasable`);

	// check to be sure player has enough currency to purchase the zone
	if (store.getState().currencies[zoneData.cost.currency] < zoneData.cost.amount) {
		warn(`Not enough currency to purchase zone ${zoneName}`);
		return;
	}

	// send to server to request purchase of zone
	purchaseZoneRemote.SendToServer(worldName, zoneName);
}
