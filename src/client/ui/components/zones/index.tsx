import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { WORLDS } from "shared/configs/worlds";
import { getZoneData } from "shared/util/getZoneData";

import { ZoneInfoDisplay } from "./zoneInfoDisplay";

/* eslint-disable jsdoc/require-jsdoc */

export function ZoneInfoUI(): Roact.Element {
	return (
		<>
			{Object.entries(WORLDS).map(([worldName, worldData]) => {
				return (
					<frame>
						{Object.entries(worldData.zones).map(([zoneName, zoneData]) => {
							const sign = Workspace.decoration[worldName][zoneName].sign.description.infoPart;
							const nextZoneData = getZoneData(worldName, { specificId: zoneData.id + 1 });

							return (
								<ZoneInfoDisplay
									zoneName={nextZoneData.name}
									worldName={worldName}
									currency={worldData.reward}
									price={nextZoneData.data.cost !== undefined ? nextZoneData.data.cost.amount : 0}
									rank={nextZoneData.data.cost !== undefined ? nextZoneData.data.cost.requiredRank : 0}
									adornee={sign}
								/>
							);
						})}
					</frame>
				);
			})}
		</>
	);
}
