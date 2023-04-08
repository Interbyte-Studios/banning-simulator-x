import Roact from "@rbxts/roact";
import { PetFrame } from "client/ui/elements/common/petFrame";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, () => (
		<PetFrame petId={1} variant={"regular"} displayBackground={true} isBillboard={false} shouldBlackout={false} />
	));

	return () => {
		cleanup();
	};
};
