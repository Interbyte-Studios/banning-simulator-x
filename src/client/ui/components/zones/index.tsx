import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { WORLDS } from "shared/configs/worlds";

import { ZoneInfoDisplay } from "./zoneInfoDisplay";

/* eslint-disable jsdoc/require-jsdoc */
export function ZoneInfoUI(): Roact.Element {
	return (
		<>
			{Object.entries(WORLDS).map(([worldName, worldData]) => {
				return (
					<>
						{Object.entries(worldData.zones).map(([zoneName, zoneData]) => {
							const sign = Workspace.decoration[worldName]
								.FindFirstChild(zoneName)
								?.FindFirstChild("sign")
								?.FindFirstChild("description")
								?.FindFirstChild("infoPart") as BasePart;

							if (sign === undefined) {
								return <></>;
							} else {
								return (
									<ZoneInfoDisplay
										zoneName={zoneName}
										worldName={worldName}
										currency={worldData.reward}
										price={zoneData.cost !== undefined ? zoneData.cost.amount : 0}
										rank={zoneData.cost !== undefined ? zoneData.cost.requiredRank : 0}
										adornee={sign}
									/>
								);
							}
						})}
					</>
				);
			})}
		</>
	);
}
