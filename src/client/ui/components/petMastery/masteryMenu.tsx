import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";
import { WorldName } from "shared/configs/worlds";

interface PetMasteryMenuProps {
	world: WorldName;
}

/**
 * Displays all the pets of a given world, and accolades for each one that give rewards.
 */
export const PetMasteryMenu = hooks((props: PetMasteryMenuProps) => {
	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={0}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(0.5, 0.5)}
			Image={""}
			ScaleType={Enum.ScaleType.Fit}
		></imagelabel>
	);
});
