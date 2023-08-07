import Make from "@rbxts/make";
import { Lighting, Players, Workspace } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { WorldName, WORLDS } from "shared/configs/worlds";
import { isStarterZone, ZoneNames, zones } from "shared/configs/zones";
import { WorldsState } from "shared/rodux/worlds";

const player = Players.LocalPlayer;

/**
 * Destroys the physical barrier preventing the player from entering the specific zone.
 *
 * @param world The world the zone is in.
 * @param zone The zone to grant entry to.
 */
function grantZoneEntry(world: WorldName, zone: ZoneNames): void {
	let zoneFolder = Lighting.FindFirstChild(zone);
	if (zoneFolder === undefined) {
		zoneFolder = Make("Folder", {
			Parent: Lighting,
			Name: zone,
		});
	}

	const zoneDecoration = Workspace.decoration[world].FindFirstChild(zone);
	if (zoneDecoration === undefined) {
		return;
	}

	const door = zoneDecoration.FindFirstChild("door") as Folder;
	if (door !== undefined) {
		const lock = door.FindFirstChild("lock");
		if (lock !== undefined) {
			lock.Parent = zoneFolder;
		}

		const passage = door.FindFirstChild("passage");
		if (passage !== undefined) {
			passage.Parent = zoneFolder;
		}
	}

	const sign = zoneDecoration.FindFirstChild("sign");
	if (sign !== undefined) {
		sign.Parent = zoneFolder;
	}
}

/**
 * Iterates through unlocked worlds and zones and grants the player entry to them.
 *
 * @param worldState The world state to read.
 */
function unlockZones(worldState: WorldsState): void {
	debug.setmemorycategory("purchasedZones");
	for (const unlockedWorld of worldState) {
		for (const [worldName] of pairs(WORLDS)) {
			if (worldName !== unlockedWorld.name) {
				continue;
			}

			for (const [zoneName, zoneData] of pairs(zones)) {
				if (zoneData.worldParent !== worldName) {
					continue;
				}

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
								const zoneDeco = Workspace.decoration[unlockedWorld.name].FindFirstChild(zoneName);
								if (zoneDeco !== undefined) {
									deco.Parent = zoneDeco;
								}
							} else {
								const zoneDeco = Workspace.decoration[unlockedWorld.name].FindFirstChild(zoneName);
								if (zoneDeco !== undefined) {
									const door = zoneDeco.FindFirstChild("door");
									if (door !== undefined) {
										deco.Parent = door;
									}
								}
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

		for (const [zoneName, zoneData] of pairs(zones)) {
			if (isStarterZone(zoneName)) {
				continue;
			}

			const zoneDeco = Workspace.decoration[zoneData.worldParent].FindFirstChild(zoneName);
			if (zoneDeco !== undefined) {
				const door = zoneDeco.FindFirstChild("door");
				if (door !== undefined) {
					door.ChildAdded.Connect(() => unlockZones(store.getState().worlds));
					door.ChildRemoved.Connect(() => unlockZones(store.getState().worlds));
				}
			} else warn(`No zone deco for ${zoneName}`);
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
