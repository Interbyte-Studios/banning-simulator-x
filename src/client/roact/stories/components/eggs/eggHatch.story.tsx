import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { EggsUI } from "client/roact/components/eggs";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory(
		{
			currencies: {
				gold: 50000000,
			},
		},
		target,
		(_, store) => (
			<RoactRodux.StoreProvider store={store}>
				<EggsUI />
			</RoactRodux.StoreProvider>
		),
	);
	return () => {
		cleanup();
	};
};
