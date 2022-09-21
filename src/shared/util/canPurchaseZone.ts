import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { PurchaseZoneFailKind, PurchaseZoneReturnType } from "shared/remotes/purchaseZone";
import { CurrenciesState } from "shared/rodux/currencies";
import { RankState } from "shared/rodux/rank";
import { WorldsState } from "shared/rodux/worlds";
import { getZoneData } from "shared/util/getZoneData";
import { getZoneDataById } from "shared/util/getZoneDataById";

/**
 * Checks if the player can purchase the zone.
 *
 * @param worldsState The player's worlds state.
 * @param currenciesState The player's currencies state.
 * @param rankState The player's rank state.
 * @param worldName The name of the world the zone belongs to.
 * @param zoneName The name of the zone to purchase.
 * @returns A boolean to determine if the player can purchase the zone.
 */
export function canPurchaseZone(
	worldsState: WorldsState,
	currenciesState: CurrenciesState,
	rankState: RankState,
	worldName: WorldName,
	zoneName: ZoneNames,
): PurchaseZoneReturnType {
	const worldData = worldsState.find((world) => world.name === worldName);
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

	if (currenciesState[zoneData.cost.currency] < zoneData.cost.amount) {
		return {
			success: false,
			reason: PurchaseZoneFailKind.NotEnoughCurrency,
		};
	}

	if (rankState < zoneData.cost.requiredRank) {
		return {
			success: false,
			reason: PurchaseZoneFailKind.NotRequiredRank,
		};
	}

	return {
		success: true,
	};
}
