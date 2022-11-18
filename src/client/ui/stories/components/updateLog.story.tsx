import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { UpdateLog } from "client/ui/components/updateLog";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<RoactRodux.StoreProvider store={store}>
			<UpdateLog enabled={true} />
		</RoactRodux.StoreProvider>
	));
	return () => {
		cleanup();
	};
};
