import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ItemInventory } from "client/ui/components/items";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<RoactRodux.StoreProvider store={store}>
			<ItemInventory visible={true} hideMenu={(): void => {}} />
		</RoactRodux.StoreProvider>
	));
	return () => {
		cleanup();
	};
};
