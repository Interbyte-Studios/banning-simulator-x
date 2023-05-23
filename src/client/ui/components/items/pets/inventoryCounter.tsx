import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { uiDarkStrokeColor } from "client/ui/commonValues";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
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
				<ImageLabel
					native={{
						Size: UDim2.fromScale(0.5, 0.7),
						Position: UDim2.fromScale(0.075, 0.5),
						Image: assetIds.images.ui.inventory.pets["pet counter icon"],
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</ImageLabel>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.3, 0.5),
						Size: UDim2.fromScale(0.3, 0.7),
						Text: `${props.pets.filter((pet) => pet.equipped).size()}/${getMaxPetEquip(props.gamepassesSize)}`,
						TextXAlignment: Enum.TextXAlignment.Left,
					}}
					stroke={{ native: { Thickness: 1.25, Color: uiDarkStrokeColor } }}
				/>
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
				<ImageLabel
					native={{
						Size: UDim2.fromScale(0.5, 0.7),
						Position: UDim2.fromScale(0.55, 0.5),
						Image: assetIds.images.ui.inventory.pets["inventory size counter icon"],
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</ImageLabel>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.775, 0.5),
						Size: UDim2.fromScale(0.3, 0.7),
						Text: `${props.pets.size()}/${getPetInventorySize(props.gamepassesSize)}`,
						TextXAlignment: Enum.TextXAlignment.Left,
					}}
					stroke={{ native: { Thickness: 1.25, Color: uiDarkStrokeColor } }}
				/>
			</>
		);
	}),
);

/**
 * Displays the counters of equipped pets and inventory size.
 */
export const PetInventoryCounterTopBar = hooks(() => {
	return (
		<ImageLabel
			native={{
				Position: UDim2.fromScale(0.525, 0.055),
				Size: UDim2.fromScale(0.4, 0.115),
				Image: assetIds.images.ui.inventory.pets.topbar,
			}}
		>
			<PetsEquippedCounter />
			<InventorySizeCounter />
		</ImageLabel>
	);
});
