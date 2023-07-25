import Make from "@rbxts/make";
import { Lighting, Players, Workspace } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { WorldName, WORLDS } from "shared/configs/worlds";
import { isStarterZone, ZoneNames } from "shared/configs/zones";
import { WorldsState } from "shared/rodux/worlds";

const player = Players.LocalPlayer;

/**
 * Destroys the physical barrier preventing the player from entering the specific zone.
 *
 * @param world The world the zone is in.
 * @param zone The zone to grant entry to.
 */
function grantZoneEntry(world: WorldName, zone: ZoneNames): void {
	const zoneDecoration = Workspace.decoration[world][zone];
	const door = zoneDecoration.door;

	task.spawn(() => {
		task.wait(1);
		let zoneFolder = Lighting.FindFirstChild(zone);
		if (zoneFolder === undefined) {
			zoneFolder = Make("Folder", {
				Parent: Lighting,
				Name: zone,
			});
		}

		const lock = door.FindFirstChild("lock");
		if (lock !== undefined) {
			lock.Parent = zoneFolder;
		}

		const passage = door.FindFirstChild("passage");
		if (passage !== undefined) {
			passage.Parent = zoneFolder;
		} else warn(`no passage for ${world} ${zone}`);

		const sign = zoneDecoration.FindFirstChild("sign");
		if (sign !== undefined) {
			sign.Parent = zoneFolder;
		}
	});
}

/**
 * Iterates through unlocked worlds and zones and grants the player entry to them.
 *
 * @param worldState The world state to read.
 */
function unlockZones(worldState: WorldsState): void {
	for (const unlockedWorld of worldState) {
		for (const [worldName, worldData] of pairs(WORLDS)) {
			if (worldName !== unlockedWorld.name) {
				continue;
			}

			for (const [zoneName] of pairs(worldData.zones)) {
				if (isStarterZone(zoneName)) {
					continue;
				}

				const ownsZone = unlockedWorld.zones.includes(zoneName);
				if (ownsZone) {
					grantZoneEntry(unlockedWorld.name, zoneName);
				} else {
					const zoneDecoration = Lighting.FindFirstChild(zoneName);
					if (zoneDecoration !== undefined) {
						for (const deco of zoneDecoration.GetChildren()) {
							if (!deco.IsA("Instance")) {
								continue;
							}

							if (deco.Name === "sign") {
								deco.Parent = Workspace.decoration[unlockedWorld.name][zoneName];
							} else {
								deco.Parent = Workspace.decoration[unlockedWorld.name][zoneName].door;
							}
						}
					}
				}
			}
		}
	}
}

onStoreCreated(player)
	.andThen((store) => {
		unlockZones(store.getState().worlds);

		for (const [worldName, worldData] of pairs(WORLDS)) {
			const worldDeco = Workspace.decoration[worldName];
			for (const [zoneName] of pairs(worldData.zones)) {
				if (isStarterZone(zoneName)) {
					continue;
				}

				const zoneDeco = worldDeco[zoneName];
				zoneDeco.door.ChildAdded.Connect(() => unlockZones(store.getState().worlds));
				zoneDeco.door.ChildRemoved.Connect(() => unlockZones(store.getState().worlds));
			}
		}

		store.changed.connect((newState, oldState) => {
			if (newState.worlds === oldState.worlds) {
				return;
			}

			unlockZones(newState.worlds);
		});
	})
	.catch((e) => {
		throw `[ Purchased Zones Handler ] - Failed to run promise callback on "onStoreCreated" for ${player.Name} | ${e}`;
	});
