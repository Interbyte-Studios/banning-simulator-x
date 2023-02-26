import Roact from "@rbxts/roact";

import { app as App } from "../app";
import { AnnouncementAPI } from "../context/AnnouncementsAPI";
import { createMockStory } from "./createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (player, store) => (
		<AnnouncementAPI>
			<App player={player} store={store} />
		</AnnouncementAPI>
	));

	return () => {
		cleanup();
	};
};
