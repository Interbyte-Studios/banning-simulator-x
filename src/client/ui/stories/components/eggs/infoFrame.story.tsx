import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { InfoFrame } from "client/ui/components/eggs/eggHatch/infoFrame";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, (_, store) => (
		<RoactRodux.StoreProvider store={store}>
			<InfoFrame id={1} eggName={"Starter"} pet={1} isVoid={false} autoDeleted={true} />
		</RoactRodux.StoreProvider>
	));
	return () => {
		cleanup();
	};
};
