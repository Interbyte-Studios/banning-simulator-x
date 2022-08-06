import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { TalismanShop } from "client/ui/components/talismans/talismanShop";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory(
		{
			talismans: [],
		},
		target,
		(_, store) => (
			<RoactRodux.StoreProvider store={store}>
				<TalismanShop />
			</RoactRodux.StoreProvider>
		),
	);

	return () => {
		cleanup();
	};
};
