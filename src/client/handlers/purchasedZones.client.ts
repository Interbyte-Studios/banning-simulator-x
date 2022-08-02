import { Lighting, Players, Workspace } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";

const player = Players.LocalPlayer;

/**
 * Destroys the physical barrier preventing the player from entering the specific zone.
 *
 * @param world The world the zone is in.
 * @param zone The zone to grant entry to.
 */
function grantZoneEntry(world: WorldName, zone: ZoneNames): void {}

onStoreCreated(player)
	.andThen((store) => {})
	.catch((e) => {
		throw `Failed to get store for player ${player.Name} | ${e}`;
	});
