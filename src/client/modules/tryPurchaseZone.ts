import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { PurchaseZoneFailKind, PurchaseZoneReturnType } from "shared/remotes/purchaseZone";
import { CurrenciesState } from "shared/rodux/currencies";
import { RankState } from "shared/rodux/rank";
import { WorldsState } from "shared/rodux/worlds";
import { canPurchaseZone } from "shared/util/canPurchaseZone";
import { getZoneData } from "shared/util/getZoneData";

/**
 * Purchases a zone for a player.
 *
 * @param currenciesState The currencies state of the player.
 * @param worldState The world state of the player.
 * @param rankState The rank state of the player.
 * @param worldName The name of the world.
 * @param zoneName The name of the zone that player purchases.
 * @returns Whether or not the purchase was successful.
 */
export function tryPurchaseZone(
	currenciesState: CurrenciesState,
	worldState: WorldsState,
	rankState: RankState,
	worldName: WorldName,
	zoneName: ZoneNames,
): PurchaseZoneReturnType {
	const checkPurchaseRequirements = canPurchaseZone(worldState, currenciesState, rankState, worldName, zoneName);

	if (checkPurchaseRequirements.success === true) {
		const zoneData = getZoneData(worldName, zoneName);
		if (zoneData.cost === undefined) {
			return {
				success: false,
				reason: PurchaseZoneFailKind.InternalError,
			};
		}

		return {
			success: true,
		};
	} else {
		return checkPurchaseRequirements;
	}
}
