import { remotes } from "shared/remotes";
import { PurchaseZoneFailKind } from "shared/remotes/purchaseZone";
import { unlockZone } from "shared/rodux/worlds";
import { getZoneData } from "shared/util/getZoneData";
import { getZoneDataById } from "shared/util/getZoneDataById";

import { withPlayerStore } from "../modules/net/withPlayerStore";

remotes.Server.Get("purchaseZone").SetCallback(
	withPlayerStore((_, store, worldName, zoneName) => {
		const currentState = store.getState();

		const worldData = currentState.worlds.find((world) => world.name === worldName);
		if (worldData === undefined) {
			return {
				success: false,
				reason: PurchaseZoneFailKind.NonlinearProgression,
			};
		}

		const doesOwnZone = worldData.zones.find((zone) => zone === zoneName) !== undefined;
		if (doesOwnZone) {
			return {
				success: false,
				reason: PurchaseZoneFailKind.NonlinearProgression,
			};
		}

		const zoneData = getZoneData(worldName, zoneName);

		// check that previous zone is a valid id.
		if (zoneData.id - 1 > 0) {
			const previousZoneData = getZoneDataById(worldName, zoneData.id - 1);
			const ownsPreviousZone = worldData.zones.find((zone) => zone === previousZoneData.name);

			if (!ownsPreviousZone) {
				return {
					success: false,
					reason: PurchaseZoneFailKind.NonlinearProgression,
				};
			}
		}

		if (zoneData.cost === undefined) {
			return {
				success: false,
				reason: PurchaseZoneFailKind.InternalError,
			};
		}

		if (currentState.currencies[zoneData.cost.currency] < zoneData.cost.amount) {
			return {
				success: false,
				reason: PurchaseZoneFailKind.NotEnoughCurrency,
			};
		}

		if (currentState.rank < zoneData.cost.requiredRank) {
			return {
				success: false,
				reason: PurchaseZoneFailKind.NotRequiredRank,
			};
		}

		store.dispatch(
			unlockZone({
				zoneName,
				worldName,
				currency: {
					amount: zoneData.cost.amount,
					type: zoneData.cost.currency,
				},
			}),
		);

		return {
			success: true,
		};
	}),
);
