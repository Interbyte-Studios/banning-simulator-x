import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { CurrencyIcon } from "client/ui/elements/currencyIcon";
import { RankIcon } from "client/ui/elements/rankIcon";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { WorldName, WORLDS } from "shared/configs/worlds";
import { isStarterZone, ZoneNames } from "shared/configs/zones";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { PurchaseZoneUI } from "./purchase";
import { ZoneSign } from "./signs";

interface ZoneUIProps {
	displayAnnouncement: (announcementType: "errors" | "announcements", message: string) => void;
}

/**
 * Generates ui's that display information for each zone.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ZonesUI = hooks((props: ZoneUIProps, { useState }) => {
	const [viewingZone, setViewedZone] = useState<{ world: WorldName; zone: number } | undefined>(undefined);

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

			const elementToDisplay = (
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
			);

			elements.push(elementToDisplay);
		}
	}

	if (viewingZone !== undefined) {
		elements.push(
			<PurchaseZoneUI
				world={viewingZone.world}
				zone={viewingZone.zone}
				displayAnnouncement={props.displayAnnouncement}
				hideMenu={(): void => setViewedZone(undefined)}
			/>,
		);
	}

	return <>{elements}</>;
});
/* eslint-enable jsdoc/require-jsdoc */
