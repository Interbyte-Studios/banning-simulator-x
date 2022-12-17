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

	const ref = Roact.createRef<ScrollingFrame>();

	const { cleanup } = createMockStory(
		{
			pets: [pet],
		},
		target,
		(_, store) => (
			<RoactRodux.StoreProvider store={store}>
				<scrollingframe Ref={ref} Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
					{/* create the "pet frame" which the PetSummary needs */}
					<imagebutton
						Size={UDim2.fromScale(0.15, 0.15)}
						Position={UDim2.fromScale(0.5, 0.5)}
						AnchorPoint={new Vector2(0.5, 0.5)}
					>
						<PetSummary storedPet={store.getState().pets[0]} inventoryFrame={ref} />
					</imagebutton>
				</scrollingframe>
			</RoactRodux.StoreProvider>
		),
	);
	return () => {
		cleanup();
	};
};
