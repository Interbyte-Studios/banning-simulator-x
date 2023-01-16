import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Hud } from "client/ui/components/hud";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<RoactRodux.StoreProvider store={store}>
			<Hud
				visible={true}
				displayCodes={(): void => {}}
				displayQuests={(): void => {}}
				displaySettings={(): void => {}}
				displayTeleportation={(): void => {}}
				displaySpinWheel={(): void => {}}
				displayItems={(): void => {}}
				displayAutoFight={(): void => {}}
			/>
		</RoactRodux.StoreProvider>
	));

	return () => {
		cleanup();
	};
};
