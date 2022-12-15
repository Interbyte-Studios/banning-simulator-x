import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ItemInventory } from "client/ui/components/items";
import { Pet } from "shared/rodux/pets";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const pets: Array<Pet> = [];

	//for (let x = 1; x <= 6; x++) {
	for (let i = 1; i <= 81; i++) {
		const pet: Pet = {
			id: i,
			guid: tostring(i),
			equipped: false,
			locked: false,
			variant: "regular",
			bans: 0,
			enhancements: {},
		};

		/*

			const voidPet: Pet = {
				id: i,
				guid: tostring(i),
				equipped: false,
				locked: false,
				variant: "void",
				bans: 1,
				enhancements: {},
			};

			const radiantPet: Pet = {
				id: i,
				guid: tostring(i),
				equipped: false,
				locked: false,
				variant: "radiant",
				bans: 1,
				enhancements: {},
			};

			*/

		pets.push(pet);
		//pets.push(voidPet);
		//pets.push(radiantPet);
	}
	//}

	const { cleanup } = createMockStory(
		{
			pets: pets,
			petTeams: {
				maxTeams: 10,
				teams: [
					{
						id: 1,
						pets: ["1", "2"],
					},
					{
						id: 2,
						pets: ["3", "4"],
					},
				],
			},
		},
		target,
		(_, store) => (
			<RoactRodux.StoreProvider store={store}>
				<ItemInventory enabled={true} visible={true} hideMenu={(): void => {}} />
			</RoactRodux.StoreProvider>
		),
	);
	return () => {
		cleanup();
	};
};
