import Roact from "@rbxts/roact";
import { ZonesUI } from "client/ui/components/zones";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, () => <ZonesUI displayAnnouncement={(): void => {}} />);
	return () => {
		cleanup();
	};
};
