import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { WORLDS } from "shared/configs/worlds";

import { ZoneInfoDisplay } from "./zoneInfoDisplay";

/**
 * Displays zone information on zone signs.
 *
 * @returns The zone info signs.
 */
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
								?.FindFirstChild("infoPart");

							if (sign === undefined) {
								return <></>;
							}

							assert(sign.IsA("BasePart"), `Expected ${sign.GetFullName()} to be a BasePart but it wasn't`);
							return (
								<ZoneInfoDisplay
									zoneName={zoneName}
									worldName={worldName}
									currency={worldData.reward}
									price={zoneData.cost?.amount ?? 0}
									rank={zoneData.cost?.requiredRank ?? 0}
									adornee={sign}
								/>
							);
						})}
					</>
				);
			})}
		</>
	);
}
