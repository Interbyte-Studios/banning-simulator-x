import Roact from "@rbxts/roact";
import { ZonePurchasePromptFrame } from "client/ui/components/zones/zonePurchase/zonePurchasePromptFrame";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, () => (
		<ZonePurchasePromptFrame
			worldName={"Ban Land"}
			zoneName={"Honeycomb"}
			onPurchase={(): void => print("purchase")}
			onCancel={(): void => print("cancel")}
		/>
	));

	return () => {
		cleanup();
	};
};
