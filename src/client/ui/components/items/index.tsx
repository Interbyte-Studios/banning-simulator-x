import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { ExitButton } from "client/ui/elements/exitButton";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

import { BottomBar } from "./bottombar";
import { PetInventory } from "./pets";
import { TalismanItems } from "./talismans/inventory";
import { WeaponItems } from "./weapons/inventory";

export type ValidInventoryType = "Pets" | "Weapons" | "Talismans" | "Titles";

interface ItemInventoryProps {
	enabled: boolean;
	visible: boolean;
	hideMenu: () => void;
}

/**
 * Item inventory user interface.
 */
export const ItemInventory = hooks((props: ItemInventoryProps, hooks) => {
	if (!props.enabled) {
		return <></>;
	}

	if (!props.visible) {
		return <></>;
	}

	const { useState } = hooks;
	const [itemInventoryVisible, setTypeOfInventoryDisplayed] = useState<ValidInventoryType>("Pets");

	const inventoryToDisplay: Array<Roact.Element> = [];
	if (itemInventoryVisible === "Pets") {
		inventoryToDisplay.push(<PetInventory />);
	} else if (itemInventoryVisible === "Weapons") {
		inventoryToDisplay.push(<WeaponItems />);
	} else if (itemInventoryVisible === "Talismans") {
		inventoryToDisplay.push(<TalismanItems />);
	}

	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.5, 0.6)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Image={assetIds.images.ui.inventory.background}
			ScaleType={Enum.ScaleType.Fit}
		>
			<uiaspectratioconstraint AspectRatio={1.36} />
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.4, 0.15)}
				Position={UDim2.fromScale(0.5, 0.075)}
				Text={itemInventoryVisible}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(122, 41, 0) }} />
			</textlabel>
			{inventoryToDisplay}
			<BottomBar
				displayPetInventory={(): void => setTypeOfInventoryDisplayed("Pets")}
				displayWeaponsInventory={(): void => setTypeOfInventoryDisplayed("Weapons")}
				displayTalismansInventory={(): void => setTypeOfInventoryDisplayed("Talismans")}
				displayTitlesInventory={(): void => setTypeOfInventoryDisplayed("Titles")}
			/>
			<ExitButton
				Position={UDim2.fromScale(0.985, 0.115)}
				minimizedSize={0.09}
				maximizedSize={0.1}
				onClosed={(): void => props.hideMenu()}
			/>
		</imagelabel>
	);
});
