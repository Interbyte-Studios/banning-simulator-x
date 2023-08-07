import { WorldName } from "shared/configs/worlds";
import { Zone, ZoneNames, zones } from "shared/configs/zones";

import { UnreachableCaseError } from "./unreachableCaseError";

/**
 * @param world The name of the world the zone is associated with.
 * @param zone The zone name.
 * @returns The metadata of the requested zone.
 */
export function getZoneData(world: WorldName, zone: ZoneNames): Zone {
	let zoneData: Zone;

	switch (world) {
		case "Ban Land":
		case "Cyber Cities": {
			zoneData = zones[zone];
			break;
		}
		default: {
			throw new UnreachableCaseError(world);
		}
	}

	return zoneData;
}
