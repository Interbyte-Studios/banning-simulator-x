import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { TalismanLevelUpAnimation } from "client/ui/components/talismanLevelUp";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<RoactRodux.StoreProvider store={store}>
			<TalismanLevelUpAnimation />
		</RoactRodux.StoreProvider>
	));
	return () => {
		cleanup();
	};
};
