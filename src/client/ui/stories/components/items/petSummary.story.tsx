import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { PetSummary } from "client/ui/components/items/pets/petSummary";
import { Pet } from "shared/rodux/pets";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const pet: Pet = {
		id: 1,
		guid: "1",
		equipped: false,
		locked: false,
		variant: "regular",
		bans: 1,
		enhancements: {},
	};

	const { cleanup } = createMockStory(
		{
			pets: [pet],
		},
		target,
		(_, store) => (
			<RoactRodux.StoreProvider store={store}>
				<PetSummary storedPet={store.getState().pets[0]} />
			</RoactRodux.StoreProvider>
		),
	);
	return () => {
		cleanup();
	};
};
