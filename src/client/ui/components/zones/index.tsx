import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { WORLDS } from "shared/configs/worlds";
import { getZoneData } from "shared/util/getZoneData";
import { ZoneInfoDisplay } from "./zoneInfoDisplay";

export function ZoneInfoUI() {
	return (
		<frame Visible={false}>
			{Object.entries(WORLDS).map(([worldName, worldData]) => {
				return (
					<frame>
						{Object.entries(worldData.zones).map(([zoneName, zoneData]) => {
							const sign = Workspace.decoration[worldName][zoneName].sign.description.infoPart;
							const nextZoneData = getZoneData(worldName, { specificId: zoneData.id + 1 })

							return (
								<ZoneInfoDisplay
									zoneName={nextZoneData.name}
									worldName={worldName}
									currency={worldData.reward}
									price={nextZoneData.cost !== undefined ? nextZoneData.cost.amount : 0}
									rank={nextZoneData.cost !== undefined ? nextZoneData.cost.requiredRank : 0}
									adornee={sign}
								/>
							);
						})}
					</frame>
				);
			})}
		</frame>
	);
}
