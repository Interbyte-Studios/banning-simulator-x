import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BSX_UIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

import { BottomBar } from "./bottombar";
import { PetInventory } from "./pets";

export type ValidInventoryType = "Pets" | "Weapons" | "Talismans" | "Titles" | "Boosts";

interface ItemInventoryProps {
	visible: boolean;
	hideMenu: () => void;
}

/**
 * Item inventory user interface.
 */
export const ItemInventory = hooks((props: ItemInventoryProps, hooks) => {
	if (!props.visible) {
		return <></>;
	}

	const { useState } = hooks;
	const [itemInventoryVisible, setTypeOfInventoryDisplayed] = useState<ValidInventoryType>("Pets");

	const inventoryToDisplay: Array<Roact.Element> = [];
	if (itemInventoryVisible === "Pets") {
		inventoryToDisplay.push(<PetInventory />);
	}

	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.5, 0.625)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Image={assetIds.images.ui.inventory.background}
			ScaleType={Enum.ScaleType.Fit}
		>
			<uiaspectratioconstraint AspectRatio={1.36} />
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.9, 0.35)}
				Position={UDim2.fromScale(0.5, 0.075)}
				Text={itemInventoryVisible}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 2, Color: Color3.fromRGB(122, 41, 0) }} />
			</textlabel>
			{inventoryToDisplay}
			<BottomBar
				displayPetInventory={(): void => setTypeOfInventoryDisplayed("Pets")}
				displayWeaponsInventory={(): void => setTypeOfInventoryDisplayed("Weapons")}
				displayTalismansInventory={(): void => setTypeOfInventoryDisplayed("Talismans")}
				displayTitlesInventory={(): void => setTypeOfInventoryDisplayed("Titles")}
				displayBoostsInventory={(): void => setTypeOfInventoryDisplayed("Boosts")}
			/>
		</imagelabel>
	);
});
