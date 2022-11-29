import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { WeaponLevelUpAnimation } from "client/ui/components/weaponLevelUp";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<RoactRodux.StoreProvider store={store}>
			<WeaponLevelUpAnimation />
		</RoactRodux.StoreProvider>
	));
	return () => {
		cleanup();
	};
};
