import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { SpinWheel } from "client/ui/components/spinWheel";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<RoactRodux.StoreProvider store={store}>
			<SpinWheel />
		</RoactRodux.StoreProvider>
	));
	return () => {
		cleanup();
	};
};
