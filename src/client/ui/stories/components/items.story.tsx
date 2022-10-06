import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ItemInventory } from "client/ui/components/items";

import { createMockStory } from "../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory(
		{
			pets: [
				{
					id: 1,
					guid: "1",
					equipped: true,
					locked: true,
					variant: "regular",
					enhancements: [],
				},
				{
					id: 1,
					guid: "1",
					equipped: true,
					locked: true,
					variant: "regular",
					enhancements: [],
				},
				{
					id: 1,
					guid: "1",
					equipped: true,
					locked: true,
					variant: "regular",
					enhancements: [],
				},
				{
					id: 1,
					guid: "1",
					equipped: true,
					locked: true,
					variant: "regular",
					enhancements: [],
				},
				{
					id: 1,
					guid: "1",
					equipped: false,
					locked: true,
					variant: "regular",
					enhancements: [],
				},
				{
					id: 1,
					guid: "1",
					equipped: false,
					locked: true,
					variant: "regular",
					enhancements: [],
				},
				{
					id: 1,
					guid: "1",
					equipped: false,
					locked: true,
					variant: "regular",
					enhancements: [],
				},
			],
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
