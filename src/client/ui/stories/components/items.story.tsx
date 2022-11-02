import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ItemInventory } from "client/ui/components/items";
import { Pet } from "shared/rodux/pets";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const pets: Array<Pet> = [];

	for (let i = 1; i < 81; i++) {
		const pet: Pet = {
			id: i,
			guid: tostring(i),
			equipped: false,
			locked: false,
			variant: "regular",
			enhancements: [],
		};

		const voidPet: Pet = {
			id: i,
			guid: tostring(i),
			equipped: false,
			locked: false,
			variant: "void",
			enhancements: [],
		};

		const radiantPet: Pet = {
			id: i,
			guid: tostring(i),
			equipped: false,
			locked: false,
			variant: "radiant",
			enhancements: [],
		};

		pets.push(pet);
		pets.push(voidPet);
		pets.push(radiantPet);
	}

	const { cleanup } = createMockStory(
		{
			pets: pets,
		},
		target,
		(_, store) => (
			<RoactRodux.StoreProvider store={store}>
				<ItemInventory visible={true} hideMenu={(): void => {}} />
			</RoactRodux.StoreProvider>
		),
	);
	return () => {
		cleanup();
	};
};
