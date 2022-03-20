import Roact from "@rbxts/roact";

import { app as App } from "../app";
import { createMockStory } from "./createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (player, store) => <App player={player} store={store} />);

	return () => {
		cleanup();
	};
};
