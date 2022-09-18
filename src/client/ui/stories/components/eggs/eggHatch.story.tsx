import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { EggsUI } from "client/ui/components/eggs";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory(
		{
			currencies: {
				coins: 50000000,
			},
		},
		target,
		(_, store) => (
			<RoactRodux.StoreProvider store={store}>
				<EggsUI store={store} setHatchingStatus={(): void => {}} />
			</RoactRodux.StoreProvider>
		),
	);
	return () => {
		cleanup();
	};
};
