import RoactRodux from "@rbxts/roact-rodux";
import { hooks } from "client/ui/hooks";
import { StoreState } from "shared/rodux";
import { PetsState } from "shared/rodux/pets";

interface PetTeamsMappedProps {
	pets: PetsState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): PetTeamsMappedProps {
	return {
		pets: state.pets,
	};
}

export const PetTeams = RoactRodux.connect(mapStateToProps)(
	hooks((props: PetTeamsMappedProps) => {
		return <></>;
	}),
);
