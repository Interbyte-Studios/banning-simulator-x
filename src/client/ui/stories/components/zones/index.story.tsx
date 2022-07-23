import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
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
							const sign = Workspace.decoration[worldName]
								.FindFirstChild(zoneName)
								?.FindFirstChild("sign")
								?.FindFirstChild("description")
								?.FindFirstChild("infoPart");

							if (sign === undefined) {
								return <></>;
							}

							assert(sign.IsA("BasePart"), `Expected sign ${sign.GetFullName()} to be a BasePart`);
							return (
								<ZoneInfoDisplay
									worldName={worldName}
									zoneName={zoneName}
									ownsZone={false}
									adornee={sign}
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
