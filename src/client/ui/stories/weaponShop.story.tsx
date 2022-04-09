import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";

import { WeaponShop } from "../components/weaponShop";
import { createMockStory } from "./createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (player, store) => (
		<RoactRodux.StoreProvider store={store}>
			<WeaponShop player={player} viewedWeaponName={"Stone Hammer"} viewedWeaponOwned={true} isVisible={true} />
		</RoactRodux.StoreProvider>
	));

	return () => {
		cleanup();
	};
};
