import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ZonesUI } from "client/roact/components/zones";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory(
		{
			worlds: [{ name: "Ban Land", zones: ["Forest"] }],
		},
		target,
		(_, store) => (
			<RoactRodux.StoreProvider store={store}>
				<ZonesUI />
			</RoactRodux.StoreProvider>
		),
	);

	return () => {
		cleanup();
	};
};
