import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { CurrenciesState } from "shared/rodux/currencies";
import { WorldsState } from "shared/rodux/worlds";
import { getZoneData } from "shared/util/getZoneData";
import { getZoneDataById } from "shared/util/getZoneDataById";

/**
 * Checks if the player can purchase the zone.
 *
 * @param worlds The Player's worlds state.
 * @param currencies The Player's currencies state.
 * @param worldName The name of the world the zone belongs to.
 * @param zoneName The name of the zone to purchase.
 */
export function zonePurchaseCheck(
	worlds: WorldsState,
	currencies: CurrenciesState,
	worldName: WorldName,
	zoneName: ZoneNames,
): void {
	const worldData = worlds.find((world) => world.name === worldName);
	if (worldData === undefined) {
		return;
	}

	const doesOwnZone = worldData.zones.find((zone) => zone === zoneName) !== undefined;
	if (doesOwnZone) {
		return;
	}

	// get zone data.
	const zoneData = getZoneData(worldName, zoneName);

	// get zone data for the previous zone.
	const previousZoneData = getZoneDataById(worldName, zoneData.id - 1);

	// check if its valid.
	if (previousZoneData === undefined) {
		return;
	}

	// check if the player owns the previous zone.
	const ownsPreviousZone = worldData.zones.find((zone) => zone === previousZoneData.name) !== undefined;
	if (!ownsPreviousZone) {
		warn(`Expected player to own previous zone ${previousZoneData.name}`);
		return;
	}

	// check to be sure if the zone is for purchase.
	if (zoneData.cost === undefined) {
		warn(`Zone ${zoneName} of world ${worldName} was not purchasable`);
		return;
	}

	// check to be sure player has enough currency to purchase the zone
	if (currencies[zoneData.cost.currency] < zoneData.cost.amount) {
		warn(`Not enough currency to purchase zone ${zoneName}`);
		return;
	}
}
