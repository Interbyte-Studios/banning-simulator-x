import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";
import { WorldName } from "shared/configs/worlds";
import { isStarterZone, zones } from "shared/configs/zones";
import { StoreState } from "shared/rodux";
import { WorldsState } from "shared/rodux/worlds";

import { PurchaseZoneUI } from "./purchase";
import { ZoneSign } from "./signs";
import { BaseZoneInfo } from "./signs/baseInfo";

interface ZonesUIMappedProps {
	worlds: WorldsState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): ZonesUIMappedProps {
	return {
		worlds: state.worlds,
	};
}

/**
 * Generates ui's that display information for each zone.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ZonesUI = RoactRodux.connect(mapStateToProps)(
	hooks((props: ZonesUIMappedProps, { useState }) => {
		const [viewingZone, setViewedZone] = useState<{ world: WorldName; zone: number } | undefined>(undefined);

		const elements: Array<Roact.Element> = [];
		for (const [zoneName, zoneData] of pairs(zones)) {
			const worldFolder = Workspace.decoration[zoneData.worldParent];
			const storedWorld = props.worlds.find((storedWorldData) => storedWorldData.name === zoneData.worldParent);
			if (storedWorld === undefined) {
				continue;
			}

			const storedZone = storedWorld.zones.find((storedZoneName) => storedZoneName === zoneName);
			if (storedZone !== undefined) {
				continue;
			}

			if (isStarterZone(zoneName)) {
				continue;
			}

			if (zoneData.cost === undefined) {
				continue;
			}

			const zoneFolder = worldFolder.FindFirstChild(zoneName) as Folder;
			if (zoneFolder === undefined) {
				continue;
			}

			const sign = zoneFolder.FindFirstChild("sign") as Folder;
			if (sign === undefined) {
				continue;
			}

			const description = sign.FindFirstChild("description") as Folder;
			if (description === undefined) {
				continue;
			}

			const descriptionDisplay = description.FindFirstChild("infoPart") as BasePart;
			if (descriptionDisplay === undefined) {
				continue;
			}

			const zoneInfo = sign.FindFirstChild("zoneInfo") as Folder;
			if (zoneInfo === undefined) {
				continue;
			}

			const zoneDisplay = zoneInfo.FindFirstChild("display") as BasePart;
			if (zoneDisplay === undefined) {
				continue;
			}

			props.worlds.forEach((world) => {
				const ownsZone = world.zones.find((zoneName) => zoneName === zoneName);
				if (ownsZone === undefined) {
					const baseInfoAdornee = zoneDisplay;

					elements.push(<BaseZoneInfo adornee={baseInfoAdornee} zoneData={zoneData} />);
				}
			});

			elements.push(
				<ZoneSign
					adornee={descriptionDisplay}
					zoneName={zoneName}
					zoneData={zoneData}
					setViewedZone={(world: WorldName, zone: number): void =>
						setViewedZone({
							world,
							zone,
						})
					}
				/>,
			);
		}

		if (viewingZone !== undefined) {
			elements.push(
				<PurchaseZoneUI
					world={viewingZone.world}
					zone={viewingZone.zone}
					hideMenu={(): void => setViewedZone(undefined)}
				/>,
			);
		}

		return <>{elements}</>;
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
