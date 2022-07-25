import Roact from "@rbxts/roact";
import Rodux from "@rbxts/rodux";
import { useMockPlayer } from "shared/mocks/player";
import { Store, storeReducer, StoreState } from "shared/rodux";

import { fakeRemoteContext, remoteContext } from "../mocks/remoteContext";

type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

/**
 * Creates a fake dummy store for a player.
 *
 * @param initialState The initial state of the store.
 * @param target The target element too mount to.
 * @param elementCallback A callback which returns the Roact element to render.
 * @returns The store created and a destructor.
 */
export function createMockStory(
	initialState: DeepPartial<StoreState>,
	target: GuiBase,
	elementCallback: (player: Player, store: Store) => Roact.Element,
): {
	store: Store;
	player: Player;
	cleanup: () => void;
} {
	const player = useMockPlayer();
	const store = new Rodux.Store(storeReducer, initialState);

	const element = elementCallback(player, store);
	// inject remote context into element
	const tree = Roact.mount(
		<remoteContext.Provider value={fakeRemoteContext}>{element}</remoteContext.Provider>,
		target,
	);

	return {
		store,
		player,
		// eslint-disable-next-line jsdoc/require-jsdoc
		cleanup: (): void => {
			store.destruct();
			Roact.unmount(tree);
		},
	};
}
