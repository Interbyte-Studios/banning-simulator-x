import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";
import { WorldName, WORLDS } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { StoreState } from "shared/rodux";
import { WorldsState } from "shared/rodux/worlds";

import { ZoneInfoDisplay } from "./zoneInfoDisplay";

interface ZoneInfoProps extends MappedZoneInfoProps {
	togglePurchasePrompt: (world: WorldName, zone: ZoneNames) => void;
}

interface MappedZoneInfoProps {
	worlds: WorldsState;
}

/**
 * @param state The current state of players store.
 * @returns The mapped props.
 */
function mapeStateToProps(state: StoreState): MappedZoneInfoProps {
	return {
		worlds: state.worlds,
	};
}

/**
 * Displays the information of every zone on their corresponding signs.
 */
export const ZonesInfo = RoactRodux.connect(mapeStateToProps)(
	hooks((props: ZoneInfoProps) => {
		return (
			<>
				{Object.entries(WORLDS).map(([worldName, worldData]) => {
					const worldInfo = props.worlds.find((world) => world.name === worldName);

					return (
						<>
							{Object.entries(worldData.zones).map(([zoneName]) => {
								const ownsZone =
									worldInfo !== undefined && worldInfo.zones.find((zone) => zone === zoneName) !== undefined;
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
										adornee={sign}
										ownsZone={ownsZone}
										onPurchase={(zoneName, worldName): void => {
											props.togglePurchasePrompt(worldName, zoneName);
										}}
									/>
								);
							})}
						</>
					);
				})}
			</>
		);
	}),
);
