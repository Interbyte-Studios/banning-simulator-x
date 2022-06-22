import Roact from "@rbxts/roact";
import { InfoFrame } from "client/ui/components/eggs/eggHatch/infoFrame";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, () => (
		<InfoFrame eggName={"Starter"} id={3} isVoid={false} pet={1} />
	));

	return () => {
		cleanup();
	};
};
