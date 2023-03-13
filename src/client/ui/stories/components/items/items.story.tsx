import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ItemInventory } from "client/ui/components/items";
import { TALISMANS } from "shared/configs/talismans";
import { WEAPONS } from "shared/configs/weapons";
import { Pet } from "shared/rodux/pets";
import { Talisman } from "shared/rodux/talismans";
import { Weapon } from "shared/rodux/weapons";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const pets: Array<Pet> = [];
	const weapons: Array<Weapon> = [];
	const talismans: Array<Talisman> = [];

	for (const [, data] of pairs(WEAPONS)) {
		weapons.push({
			id: data.id,
			bans: 0,
			level: 10,
		});
	}

	for (const [, data] of pairs(TALISMANS)) {
		talismans.push({
			id: data.id,
			bans: 0,
			phase: "artifact",
		});
	}

	for (let i = 1; i <= 81; i++) {
		const pet: Pet = {
			id: i,
			guid: `Regular-${tostring(i)}`,
			equipped: false,
			locked: false,
			variant: "regular",
			bans: 600,
			enhancements: {},
			tradeLocked: false,
		};

		const voidPet: Pet = {
			id: i,
			guid: `Void-${tostring(i)}`,
			equipped: false,
			locked: false,
			variant: "void",
			bans: 1200,
			enhancements: {},
			tradeLocked: false,
		};

		const radiantPet: Pet = {
			id: i,
			guid: `Radiant-${tostring(i)}`,
			equipped: false,
			locked: false,
			variant: "radiant",
			bans: 2000,
			enhancements: {},
			tradeLocked: false,
		};

		pets.push(pet);
		pets.push(voidPet);
		pets.push(radiantPet);
	}

	const { cleanup } = createMockStory(
		{
			pets: pets,
			weapons: weapons,
			talismans: talismans,
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
