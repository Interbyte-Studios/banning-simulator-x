import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { CodesMenu } from "client/ui/components/codes/menu";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<RoactRodux.StoreProvider store={store}>
			<CodesMenu visible={true} hideMenu={(): void => {}} />
		</RoactRodux.StoreProvider>
	));
	return () => {
		cleanup();
	};
};
