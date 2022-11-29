import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { TalismanLevelUpAnimation } from "client/ui/components/talismanLevelUp";
import { TalismanPhases } from "shared/configs/talismans";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory(
		{
			currentTalisman: 1,
			talismans: new Map<number, { bans: number; phase: TalismanPhases }>([[1, { bans: 1, phase: "artifact" }]]),
		},
		target,
		(_, store) => (
			<RoactRodux.StoreProvider store={store}>
				<TalismanLevelUpAnimation enabled={true} />
			</RoactRodux.StoreProvider>
		),
	);
	return () => {
		cleanup();
	};
};
