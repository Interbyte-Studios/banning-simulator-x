import { WorldName } from "shared/configs/worlds";
import { Zone, ZoneNames } from "shared/configs/zones";
import { BAN_LAND_ZONES } from "shared/configs/zones/banLand";

import { UnreachableCaseError } from "./unreachableCaseError";

interface ZoneData extends Zone {
	name: ZoneNames
}

/**
 * @param world The name of the world the zone is associated with.
 * @param searchSpecifics A table containing properties to find a specific zone.
 * @param searchSpecifics.zone The name of the zone (Optional).
 * @param searchSpecifics.specificId The unique id of the zone (Optional).
 * @returns The metadata of the requested zone.
 */
export function getZoneData(world: WorldName, searchSpecifics: { zone?: ZoneNames; specificId?: number }): ZoneData {
	if (searchSpecifics.zone !== undefined && searchSpecifics.specificId !== undefined) {
		warn(`Expected one method of searching for a zone but received two.`)
	}

	let zoneData: ZoneData = { name: "forest", ...BAN_LAND_ZONES["forest"] }

	switch (world) {
		case "ban land": {
			if (searchSpecifics.zone !== undefined) {
				zoneData = {
					name: searchSpecifics.zone,
					...BAN_LAND_ZONES[searchSpecifics.zone]
				}
			} else if (searchSpecifics.specificId !== undefined) {
				for (const [zoneName, _zoneData] of pairs(BAN_LAND_ZONES)) {
					if (_zoneData.id !== searchSpecifics.specificId) {
						continue;
					}

					zoneData = {
						name: zoneName,
						..._zoneData
					}
				}
			}
			break;
		}
		default: {
			throw new UnreachableCaseError(world);
		}
	}
	assert(
		zoneData,
		`Failed to get zone data with search specific given | World: ${world} | Search Specifics: ${searchSpecifics} |`,
	);

	return zoneData;
}