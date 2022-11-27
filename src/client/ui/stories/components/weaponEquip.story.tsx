import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { WeaponEquip } from "client/ui/components/equip/weaponEquip";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<RoactRodux.StoreProvider store={store}>
			<WeaponEquip visible={true} />
		</RoactRodux.StoreProvider>
	));
	return () => {
		cleanup();
	};
};
