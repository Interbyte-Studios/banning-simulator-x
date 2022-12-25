import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";
import { WorldName, WORLDS } from "shared/configs/worlds";
import { isStarterZone } from "shared/configs/zones";

import { PurchaseZoneUI } from "./purchase";
import { ZoneSign } from "./signs";
import { BaseZoneInfo } from "./signs/baseInfo";

/**
 * Generates ui's that display information for each zone.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ZonesUI = hooks((props: { enabled: boolean }, { useState }) => {
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

			const baseInfoAdornee = sign.zoneInfo.display;

			const elementToDisplay = (
				<>
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
					/>
					<BaseZoneInfo adornee={baseInfoAdornee} zoneData={zoneData} />
				</>
			);

			elements.push(elementToDisplay);
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
});
/* eslint-enable jsdoc/require-jsdoc */
