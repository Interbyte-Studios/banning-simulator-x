import { retrieveStore } from "server/playerStore";
import { Store } from "shared/rodux";

/**
 * A wrapper function which can be applied to Net events in order to simplify retrieval of the player Rodux store.
 *
 * @param callback The callback to call with the player and store included.
 * @returns A function that can be used to apply to a Net remote connection which accepts the player and some args, and returns the player, plus the store, and the args.
 */
export function withPlayerStore<T extends Array<unknown>, R>(
	callback: (player: Player, store: Store, ...args: T) => R,
) {
	return (player: Player, ...args: T): R => {
		const store = retrieveStore(player);
		if (!store) {
			throw `Store did not exist for ${player.Name}`;
		}

		return callback(player, store, ...args);
	};
}
