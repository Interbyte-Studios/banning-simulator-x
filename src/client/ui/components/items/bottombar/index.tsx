import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";

import { DisplayBoostsInventory } from "./displayBoostsInventory";
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
	displayBoostsInventory: () => void;
}

export const BottomBar = hooks((props: BottomBarProps) => {
	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 0.15)}
			Position={UDim2.fromScale(0.5, 1.075)}
		>
			<uilistlayout
				Padding={new UDim(0.05, 0)}
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			<DisplayPetInventory displayPetInventory={props.displayPetInventory} />
			<DisplayWeaponsInventory displayWeaponsInventory={props.displayWeaponsInventory} />
			<DisplayTalismansInventory displayTalismansInventory={props.displayTalismansInventory} />
			<DisplayTitlesInventory displayTitlesInventory={props.displayTitlesInventory} />
			<DisplayBoostsInventory displayBoostsInventory={props.displayBoostsInventory} />
		</frame>
	);
});
