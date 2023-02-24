import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { AccountHub } from "client/ui/components/account";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<RoactRodux.StoreProvider store={store}>
			<AccountHub enabled={true} hideMenu={(): void => {}} />
		</RoactRodux.StoreProvider>
	));
	return () => {
		cleanup();
	};
};
