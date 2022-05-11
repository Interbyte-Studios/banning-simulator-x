import { WorldNames } from "shared/configs/worlds";
import { Zone, ZoneNames } from "shared/configs/zones";
import { BAN_LAND_ZONES } from "shared/configs/zones/banLand";

/**
 * @param world The name of the world the zone is associated with.
 * @param zone The zone name.
 * @returns The metadata of the requested zone.
 */
export function getZoneData(world: WorldNames, zone: ZoneNames): Zone {
	let zoneData: Zone;

	switch (world) {
		case "Ban Land": {
			zoneData = BAN_LAND_ZONES[zone];
			break;
		}
	}

	assert(zoneData, `Could not find data for zone: "${zone}" from world: "${world}"`);

	return zoneData;
}
