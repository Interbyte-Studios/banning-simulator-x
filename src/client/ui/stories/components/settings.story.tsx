import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { SettingsUI } from "client/ui/components/settings";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<RoactRodux.StoreProvider store={store}>
			<SettingsUI />
		</RoactRodux.StoreProvider>
	));
	return () => {
		cleanup();
	};
};
