import Roact from "@rbxts/roact";
import { ZoneInfoDisplay } from "client/roact/components/zones/zoneInfo/zoneInfoDisplay";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, () => (
		<ZoneInfoDisplay
			worldName={"Ban Land"}
			zoneName={"Honeycomb"}
			ownsZone={false}
			adornee={new Instance("Part")}
			onPurchase={(): void => print("purchase")}
		/>
	));

	return () => {
		cleanup();
	};
};
