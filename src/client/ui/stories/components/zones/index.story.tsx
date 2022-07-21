import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { ZoneInfoDisplay } from "client/ui/components/zones/zoneInfo/zoneInfoDisplay";
import { ZonePurchasePromptFrame } from "client/ui/components/zones/zonePurchase/zonePurchasePromptFrame";
import { WORLDS } from "shared/configs/worlds";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, () => (
		<>
			{Object.entries(WORLDS).map(([worldName, worldData]) => {
				return (
					<>
						{Object.entries(worldData.zones).map(([zoneName]) => {
							return (
								<ZoneInfoDisplay
									worldName={worldName}
									zoneName={zoneName}
									ownsZone={false}
									adornee={new Instance("Part")}
									onPurchase={(): void => print("Purchase")}
								/>
							);
						})}
					</>
				);
			})}
			<ZonePurchasePromptFrame
				worldName={"Ban Land"}
				zoneName={"Honeycomb"}
				onPurchase={(): void => print("Purchase")}
				onCancel={(): void => print("Cancel")}
			/>
		</>
	));

	return () => {
		cleanup();
	};
};
