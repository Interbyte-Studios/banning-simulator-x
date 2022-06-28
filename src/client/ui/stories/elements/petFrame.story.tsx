import Roact from "@rbxts/roact";
import { PetFrame } from "client/ui/elements/petFrame";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, () => <PetFrame eggName={"Starter"} petId={1} variant={"regular"} />);

	return () => {
		cleanup();
	};
};
