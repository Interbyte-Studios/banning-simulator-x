import { WorldName } from "shared/configs/worlds";
import { Zone, ZoneNames, zones } from "shared/configs/zones";

interface ZoneInfo extends Zone {
	name: ZoneNames;
}

/**
 * Returns the data of the zone by the id of the zone.
 *
 * @param worldName Name of the world the zone belongs to.
 * @param id The id of the zone.
 * @returns Zone config data.
 */
export function getZoneDataById(worldName: WorldName, id: number): ZoneInfo {
	for (const [zoneName, zone] of pairs(zones)) {
		if (zone.id === id) {
			return { ...zone, name: zoneName };
		}
	}

	throw `Expected to get data for zone of Id:${id} of world:${worldName}`;
}
