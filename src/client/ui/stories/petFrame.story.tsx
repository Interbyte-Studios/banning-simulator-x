import Roact from "@rbxts/roact";

import { PetFrame } from "../elements/petFrame";
import { createMockStory } from "./createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, () => <PetFrame eggName={"Starter"} petId={1} variant={"regular"} />);

	return () => {
		cleanup();
	};
};
