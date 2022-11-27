import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { IndexPetCard } from "client/ui/components/petMastery/masteryMenu/pets/petScroll/petCard";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<RoactRodux.StoreProvider store={store}>
			<IndexPetCard pet={1} currentPet={1} currentVariant={"regular"} displayPet={(): void => {}} />
		</RoactRodux.StoreProvider>
	));
	return () => {
		cleanup();
	};
};
