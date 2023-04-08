import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { GamepassesState } from "shared/rodux/gamepasses";
import { PetsState } from "shared/rodux/pets";
import { getMaxPetEquip } from "shared/util/getMaxPetEquip";
import { getPetInventorySize } from "shared/util/getPetInventorySize";

interface PetInventoryCounterMappedProps {
	pets: PetsState;
	gamepassesSize: GamepassesState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function petInventoryCounterMapStateToProps(state: StoreState): PetInventoryCounterMappedProps {
	return {
		pets: state.pets,
		gamepassesSize: state.gamepasses,
	};
}

/**
 * Displays the amount of pets a player can have equipped, and how many the player currently has equipped.
 */
export const PetsEquippedCounter = RoactRodux.connect(petInventoryCounterMapStateToProps)(
	hooks((props: PetInventoryCounterMappedProps) => {
		return (
			<>
				<imagelabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.5, 0.7)}
					Position={UDim2.fromScale(0.075, 0.5)}
					Image={assetIds.images.ui.inventory.pets["pet counter icon"]}
					ScaleType={Enum.ScaleType.Fit}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</imagelabel>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Size={UDim2.fromScale(0.3, 0.7)}
					Position={UDim2.fromScale(0.3, 0.5)}
					Text={`${props.pets.filter((pet) => pet.equipped).size()}/${getMaxPetEquip(props.gamepassesSize)}`}
					Font={font}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextXAlignment={Enum.TextXAlignment.Left}
				>
					<BaseUIStroke native={{ Thickness: 1.25, Color: Color3.fromRGB(0, 41, 128) }} />
				</textlabel>
			</>
		);
	}),
);

/**
 * Displays the player's inventory size and how many spots are occupied.
 */
export const InventorySizeCounter = RoactRodux.connect(petInventoryCounterMapStateToProps)(
	hooks((props: PetInventoryCounterMappedProps) => {
		return (
			<>
				<imagelabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.5, 0.7)}
					Position={UDim2.fromScale(0.55, 0.5)}
					Image={assetIds.images.ui.inventory.pets["inventory size counter icon"]}
					ScaleType={Enum.ScaleType.Fit}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</imagelabel>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Size={UDim2.fromScale(0.35, 0.7)}
					Position={UDim2.fromScale(0.8, 0.5)}
					Text={`${props.pets.size()}/${getPetInventorySize(props.gamepassesSize)}`}
					Font={font}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextXAlignment={Enum.TextXAlignment.Left}
				>
					<BaseUIStroke native={{ Thickness: 1.25, Color: Color3.fromRGB(0, 41, 128) }} />
				</textlabel>
			</>
		);
	}),
);

/**
 * Displays the counters of equipped pets and inventory size.
 */
export const PetInventoryCounterTopBar = hooks(() => {
	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.4, 0.115)}
			Position={UDim2.fromScale(0.525, 0.055)}
			Image={assetIds.images.ui.inventory.pets.topbar}
			ScaleType={Enum.ScaleType.Fit}
		>
			<PetsEquippedCounter />
			<InventorySizeCounter />
		</imagelabel>
	);
});
