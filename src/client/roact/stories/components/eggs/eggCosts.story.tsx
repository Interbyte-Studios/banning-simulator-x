import Roact from "@rbxts/roact";
import { EggCost } from "client/roact/components/eggs/eggCosts";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, () => <EggCost />);

	return () => {
		cleanup();
	};
};
