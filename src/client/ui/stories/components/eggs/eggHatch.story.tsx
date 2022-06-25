import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { EggsUI } from "client/ui/components/eggs";
import { fakeRemoteContext, remoteContext } from "client/ui/remoteContext";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<remoteContext.Provider value={fakeRemoteContext}>
			<RoactRodux.StoreProvider store={store}>
				<EggsUI />
			</RoactRodux.StoreProvider>
		</remoteContext.Provider>
	));
	return () => {
		cleanup();
	};
};
