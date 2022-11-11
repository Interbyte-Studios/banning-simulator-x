import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { RankUpgrade } from "client/ui/components/ranks/menu";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<RoactRodux.StoreProvider store={store}>
			<RankUpgrade enabled={true} displayAnnouncement={(): void => {}} />
		</RoactRodux.StoreProvider>
	));

	return () => {
		cleanup();
	};
};
