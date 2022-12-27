import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";
import { WorldName, WORLDS } from "shared/configs/worlds";
import { isStarterZone } from "shared/configs/zones";
import { StoreState } from "shared/rodux";
import { WorldsState } from "shared/rodux/worlds";

import { PurchaseZoneUI } from "./purchase";
import { ZoneSign } from "./signs";
import { BaseZoneInfo } from "./signs/baseInfo";

interface ZonesUIProps extends ZonesUIMappedProps {
	enabled: boolean;
}

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
	hooks((props: ZonesUIProps, { useState }) => {
		const [viewingZone, setViewedZone] = useState<{ world: WorldName; zone: number } | undefined>(undefined);

		if (!props.enabled) {
			return <></>;
		}

		const elements: Array<Roact.Element> = [];

		for (const [worldName, worldData] of pairs(WORLDS)) {
			const worldFolder = Workspace.decoration[worldName];

			for (const [zoneName, zoneData] of pairs(worldData.zones)) {
				if (isStarterZone(zoneName)) {
					continue;
				}

				if (zoneData.cost === undefined) {
					continue;
				}

				const zoneFolder = worldFolder[zoneName];
				const sign = zoneFolder.sign;
				const adorneePart = sign.description.infoPart;

				props.worlds.forEach((world) => {
					const ownsZone = world.zones.find((zoneName) => zoneName === zoneName);
					if (ownsZone === undefined) {
						const baseInfoAdornee = sign.zoneInfo.display;

						elements.push(<BaseZoneInfo adornee={baseInfoAdornee} zoneData={zoneData} />);
					}
				});

				elements.push(
					<ZoneSign
						adornee={adorneePart}
						zoneName={zoneName}
						zoneData={zoneData}
						worldName={worldName}
						setViewedZone={(world: WorldName, zone: number): void =>
							setViewedZone({
								world,
								zone,
							})
						}
					/>,
				);
			}
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
