import { WorldName } from "shared/configs/worlds";
import { Zone, ZoneNames } from "shared/configs/zones";
import { BAN_LAND_ZONES } from "shared/configs/zones/banLand";

import { UnreachableCaseError } from "./unreachableCaseError";

/**
 * @param world The name of the world the zone is associated with.
 * @param zone The zone name.
 * @returns The metadata of the requested zone.
 */
export function getZoneData(world: WorldName, zone: ZoneNames): Zone {
	let zoneData: Zone;

	switch (world) {
		case "ban land": {
			zoneData = BAN_LAND_ZONES[zone];
			break;
		}
		default: {
			throw new UnreachableCaseError(world);
		}
	}

	return zoneData;
}
