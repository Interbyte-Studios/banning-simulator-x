import Roact from "@rbxts/roact";
import { StoreProvider } from "@rbxts/roact-rodux";
import { Quests } from "client/roact/components/quests";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<StoreProvider store={store}>
			<Quests />
		</StoreProvider>
	));

	return () => {
		cleanup();
	};
};
