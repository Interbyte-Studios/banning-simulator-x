import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";

import { PetInventoryCounterTopBar } from "./inventoryCounter";
import { PetInventorySearch } from "./search";

/**
 * Interface that displays the player's pets.
 */
export const PetInventory = hooks(() => {
	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.975, 0.785)}
			Position={UDim2.fromScale(0.5, 0.565)}
		>
			<PetInventoryCounterTopBar />
			<PetInventorySearch />
		</frame>
	);
});
