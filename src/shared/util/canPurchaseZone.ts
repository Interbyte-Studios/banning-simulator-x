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
 * @returns A boolean to determine if the player can purchase the zone.
 */
export function canPurchaseZone(
	worlds: WorldsState,
	currencies: CurrenciesState,
	worldName: WorldName,
	zoneName: ZoneNames,
): boolean {
	const worldData = worlds.find((world) => world.name === worldName);
	if (worldData === undefined) {
		return false;
	}

	const doesOwnZone = worldData.zones.find((zone) => zone === zoneName) !== undefined;
	if (doesOwnZone) {
		return false;
	}

	const zoneData = getZoneData(worldName, zoneName);
	const previousZoneData = getZoneDataById(worldName, zoneData.id - 1);
	const ownsPreviousZone = worldData.zones.find((zone) => zone === previousZoneData.name);

	if (previousZoneData !== undefined && !ownsPreviousZone) {
		warn(`Expected player to own previous zone ${previousZoneData.name}`);
		return false;
	}

	if (zoneData.cost === undefined) {
		warn(`Zone ${zoneName} of world ${worldName} was not purchasable`);
		return false;
	}

	if (currencies[zoneData.cost.currency] < zoneData.cost.amount) {
		warn(`Not enough currency to purchase zone ${zoneName}`);
		return false;
	}

	return true;
}
