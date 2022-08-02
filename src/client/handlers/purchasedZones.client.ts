import { Store } from "@rbxts/rodux";
import { Players, Workspace } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { WorldsState } from "shared/rodux/worlds";
import { getZoneData } from "shared/util/getZoneData";
import { getZoneDataById } from "shared/util/getZoneDataById";

const player = Players.LocalPlayer;

/**
 * Destroys the physical barrier preventing the player from entering the specific zone.
 *
 * @param world The world the zone is in.
 * @param zone The zone to grant entry to.
 */
function grantZoneEntry(world: WorldName, zone: ZoneNames): void {
	const barrierFolder = Workspace.decoration[world][zone].door;

	const locksFolder = barrierFolder.FindFirstChild("locks");
	if (locksFolder) {
		locksFolder.Destroy();
	}

	const passage = barrierFolder.FindFirstChild("passage");
	if (passage) {
		passage.Destroy();
	}
}

/**
 * Iterates through unlocked worlds and zones and grants the player entry to them.
 *
 * @param worldState The world state to read.
 */
function unlockZones(worldState: WorldsState): void {
	for (const unlockedWorld of worldState) {
		for (const unlockedZone of unlockedWorld.zones) {
			const zoneInfo = getZoneData(unlockedWorld.name, unlockedZone);
			const nextZone = getZoneDataById(unlockedWorld.name, zoneInfo.id + 1);

			const ownsNextZone = unlockedWorld.zones.find((zone) => zone === nextZone.name);
			if (ownsNextZone === undefined) {
				return;
			}

			grantZoneEntry(unlockedWorld.name, unlockedZone);
		}
	}
}

onStoreCreated(player)
	.andThen((store) => {
		unlockZones(store.getState().worlds);

		store.changed.connect((newState, oldState) => {
			if (newState.worlds === oldState.worlds) {
				return;
			}

			unlockZones(newState.worlds);
		});
	})
	.catch((e) => {
		throw `Failed to get store for player ${player.Name} | ${e}`;
	});
