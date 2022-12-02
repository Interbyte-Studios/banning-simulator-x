import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Teleportation } from "client/ui/components/teleportation";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory(
		{
			worlds: [
				{
					name: "Ban Land",
					zones: ["Forest"],
				},
			],
		},
		target,
		(_, store) => (
			<RoactRodux.StoreProvider store={store}>
				<Teleportation enabled={true} visible={true} hideMenu={(): void => {}} />
			</RoactRodux.StoreProvider>
		),
	);
	return () => {
		cleanup();
	};
};
