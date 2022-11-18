import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { PetMasteryMenu } from "client/ui/components/petMastery/masteryMenu";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<RoactRodux.StoreProvider store={store}>
			<PetMasteryMenu world={"Ban Land"} />
		</RoactRodux.StoreProvider>
	));
	return () => {
		cleanup();
	};
};
