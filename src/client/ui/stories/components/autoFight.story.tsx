import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { AutoFight } from "client/ui/components/auto fight";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory(
		{
			gamepasses: {
				Teleportation: true,
			},
		},
		target,
		(_, store) => (
			<RoactRodux.StoreProvider store={store}>
				<AutoFight enabled={true} hideMenu={(): void => {}} />
			</RoactRodux.StoreProvider>
		),
	);
	return () => {
		cleanup();
	};
};
