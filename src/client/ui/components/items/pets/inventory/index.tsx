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
			pets={props.pets.map((pet, index) => {
				if (index < 15) {
					return { ...pet, isRendered: true };
				}

				return { ...pet, isRendered: false };
			})}
			searchText={props.searchText}
			multiDeleteEnabled={props.multiDeleteEnabled}
			addPetToDeletionRegistry={props.addPetToDeletionRegistry}
			removePetFromDeletionRegistry={props.removePetFromDeletionRegistry}
			displayPetInfo={props.displayPetInfo}
		/>
	);
});
