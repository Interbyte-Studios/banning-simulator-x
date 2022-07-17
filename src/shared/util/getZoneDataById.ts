import { WorldName, WORLDS } from "shared/configs/worlds";
import { Zone, ZoneNames } from "shared/configs/zones";

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
export function getZoneDataById(worldName: WorldName, id: number): ZoneInfo | undefined {
	const worldData = WORLDS[worldName];

	for (const [zoneName, zone] of pairs(worldData.zones)) {
		if (zone.id === id) {
			return { ...zone, name: zoneName };
		}
	}
}
