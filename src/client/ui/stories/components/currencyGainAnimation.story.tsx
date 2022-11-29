import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { CurrencyGainAnimation } from "client/ui/components/currencyGainAnimation";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<RoactRodux.StoreProvider store={store}>
			<CurrencyGainAnimation />
		</RoactRodux.StoreProvider>
	));
	return () => {
		cleanup();
	};
};
