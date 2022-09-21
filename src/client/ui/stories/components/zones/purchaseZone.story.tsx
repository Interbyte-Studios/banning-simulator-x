import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { PurchaseZoneUI } from "client/ui/components/zones/purchase";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<RoactRodux.StoreProvider store={store}>
			<PurchaseZoneUI world={"Ban Land"} zone={2} displayAnnouncement={(): void => {}} hideMenu={(): void => {}} />
		</RoactRodux.StoreProvider>
	));
	return () => {
		cleanup();
	};
};
