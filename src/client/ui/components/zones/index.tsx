import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { purchaseZone } from "client/purchaseZone";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { WorldName, WORLDS } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { Store } from "shared/rodux";

import { ZoneInfoDisplay } from "./zoneInfoDisplay";
import { ZonePurhasePromtpFrame } from "./zonePurchase/zonePurchasePromptFrame";

interface ZoneInfoUIProps {
	store: Store;
}

interface PromptInfo {
	world: WorldName;
	zone: ZoneNames;
}

/**
 * Displays zone information on zone signs.
 *
 * @returns The zone info signs.
 */
export const ZoneInfoUI = hooks((props: ZoneInfoUIProps, { useState, useContext }) => {
	const [promptStatus, updatePromptStatus] = useState<boolean>(false);
	const [selectedInfo, updateInfo] = useState<PromptInfo>({ world: "Ban Land", zone: "Forest" });
	const remotes = useContext(remoteContext);

	return (
		<>
			<ZonePurhasePromtpFrame
				worldName={selectedInfo.world}
				zoneName={selectedInfo.zone}
				visibility={promptStatus}
				selectedAction={(action: boolean): void => {
					if (action && promptStatus) {
						purchaseZone(props.store, selectedInfo.world, selectedInfo.zone, remotes.purchaseZone);
						updatePromptStatus(false);
					} else updatePromptStatus(false);
				}}
			/>
			{Object.entries(WORLDS).map(([worldName, worldData]) => {
				const worldInfo = props.store.getState().worlds.find((world) => world.name === worldName);

				return (
					<>
						{Object.entries(worldData.zones).map(([zoneName, zoneData]) => {
							const ownsZone =
								worldInfo !== undefined ? worldInfo?.zones.find((zone) => zone === zoneName) !== undefined : false;
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
									ownsZone={ownsZone}
									purchaseClicked={(zoneName: ZoneNames, worldName: WorldName): void => {
										updateInfo({ world: worldName, zone: zoneName });
										updatePromptStatus(true);
									}}
								/>
							);
						})}
					</>
				);
			})}
		</>
	);
});
