import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { VirtualScroll } from "client/ui/elements/petUtility/virtualScroll";
import { StoreState } from "shared/rodux";
import { Pet, PetsState } from "shared/rodux/pets";

export interface PetInventoryData extends Pet {
	isRendered: boolean;
}

interface PetItemsProps extends PetItemsMappedProps {
	multiDeleteEnabled: boolean;
	searchText: string | undefined;
	addPetToDeletionRegistry: (guid: string) => void;
	removePetFromDeletionRegistry: (guid: string) => void;
	displayPetInfo: (guid: string) => void;
}

interface PetItemsMappedProps {
	pets: PetsState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function petItemsMapStateToProps(state: StoreState): PetItemsMappedProps {
	return {
		pets: state.pets,
	};
}

export const PetItems = RoactRodux.connect(petItemsMapStateToProps)((props: PetItemsProps) => {
	return (
		<VirtualScroll
			pets={props.pets}
			searchText={props.searchText}
			size={UDim2.fromScale(0.965, 0.74)}
			position={UDim2.fromScale(0.5, 0.495)}
			scrollBarImageColor={Color3.fromRGB(0, 51, 80)}
			scrollBarThickness={12}
			inventoryFrame={{
				multiDeleteEnabled: props.multiDeleteEnabled,
				addPetToDeletionRegistry: props.addPetToDeletionRegistry,
				removePetFromDeletionRegistry: props.removePetFromDeletionRegistry,
				displayPetInfo: props.displayPetInfo,
			}}
		/>
	);
});
