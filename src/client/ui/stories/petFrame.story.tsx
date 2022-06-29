import Roact from "@rbxts/roact";

import { udim2TopMiddle, vec2Middle } from "../commonValues";
import { PetFrame } from "../elements/petFrame";
import { createMockStory } from "./createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, () => (
		<frame AnchorPoint={vec2Middle} Position={udim2TopMiddle} Size={udim2TopMiddle} BackgroundTransparency={0}>
			<PetFrame eggName={"Starter"} petId={1} variant={"regular"} />
		</frame>
	));

	return () => {
		cleanup();
	};
};
