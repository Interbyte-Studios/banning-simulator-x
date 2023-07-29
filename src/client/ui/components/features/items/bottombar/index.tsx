import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";

import { DisplayPetInventory } from "./displayPetInventory";
import { DisplayTalismansInventory } from "./displayTalismansInventory";
import { DisplayTitlesInventory } from "./displayTitlesInventory";
import { DisplayWeaponsInventory } from "./displayWeaponInventory";

export type ValidInventoryType = "Pets" | "Weapons" | "Talismans" | "Titles" | "Boost";
interface BottomBarProps {
	displayPetInventory: () => void;
	displayWeaponsInventory: () => void;
	displayTalismansInventory: () => void;
	displayTitlesInventory: () => void;
}

export const BottomBar = hooks((props: BottomBarProps) => {
	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(1.08, 0.55)}
			Size={UDim2.fromScale(0.15, 0.45)}
		>
			<uilistlayout
				Padding={new UDim(0.1, 0)}
				FillDirection={Enum.FillDirection.Vertical}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			<DisplayPetInventory displayPetInventory={props.displayPetInventory} />
			<DisplayWeaponsInventory displayWeaponsInventory={props.displayWeaponsInventory} />
			<DisplayTalismansInventory displayTalismansInventory={props.displayTalismansInventory} />
			<DisplayTitlesInventory displayTitlesInventory={props.displayTitlesInventory} />
		</frame>
	);
});
