import { Players } from "@rbxts/services";
import { onStoreCreated } from "server/playerStore";
import { deletePets } from "shared/rodux/pets";

/**
 * @param player The player.
 */
async function onPlayerAdded(player: Player): Promise<void> {
	const store = await onStoreCreated(player);
	const petsToDelete: Array<string> = [];
	for (const pet of store.getState().pets) {
		if (
			pet.id === 177 ||
			pet.id === 178 ||
			pet.id === 179 ||
			pet.id === 180 ||
			pet.id === 185 ||
			pet.id === 186 ||
			pet.id === 187 ||
			pet.id === 188 ||
			pet.id === 189 ||
			pet.id === 190 ||
			pet.id === 95 ||
			pet.id === 96
		) {
			petsToDelete.push(pet.guid);
		}
	}
	store.dispatch(deletePets(petsToDelete));
}

for (const player of Players.GetPlayers()) {
	onPlayerAdded(player).catch((e) => error(e));
}

Players.PlayerAdded.Connect(async (player) => {
	await onPlayerAdded(player);
});
