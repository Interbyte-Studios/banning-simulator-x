import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { SettingsMenu } from "client/ui/components/settings/menu";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<RoactRodux.StoreProvider store={store}>
			<SettingsMenu visible={true} hideMenu={(): void => {}} />
		</RoactRodux.StoreProvider>
	));
	return () => {
		cleanup();
	};
};
