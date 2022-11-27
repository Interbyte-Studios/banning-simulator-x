import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { LocalMessages } from "client/ui/components/announcements";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<RoactRodux.StoreProvider store={store}>
			<LocalMessages />
		</RoactRodux.StoreProvider>
	));
	return () => {
		cleanup();
	};
};
