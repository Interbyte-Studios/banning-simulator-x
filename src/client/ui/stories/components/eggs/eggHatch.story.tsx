import Roact from "@rbxts/roact";
import { EggsUI } from "client/ui/components/eggs";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory(
		{
			currencies: {
				gold: 50000000,
			},
		},
		target,
		() => <EggsUI />,
	);
	return () => {
		cleanup();
	};
};
