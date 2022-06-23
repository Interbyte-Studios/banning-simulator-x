/* eslint-disable @typescript-eslint/no-magic-numbers */
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { WeaponShop } from "client/ui/components/weapons/weaponShop";
import { fakeRemoteContext, remoteContext } from "client/ui/remoteContext";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory(
		{
			currencies: {
				gold: 100_000,
			},
		},
		target,
		(_, store) => (
			<remoteContext.Provider value={fakeRemoteContext}>
				<RoactRodux.StoreProvider store={store}>
					<WeaponShop store={store} />
				</RoactRodux.StoreProvider>
			</remoteContext.Provider>
		),
	);

	return () => {
		cleanup();
	};
};
