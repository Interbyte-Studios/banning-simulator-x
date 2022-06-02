import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";

import { ToggleWeaponButton } from "../components/weapons/toggleWeaponButton";
import { createMockStory } from "./createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (player, store) => (
		<RoactRodux.StoreProvider store={store}>
			<ToggleWeaponButton player={player} />
		</RoactRodux.StoreProvider>
	));

	return () => {
		cleanup();
	};
};
