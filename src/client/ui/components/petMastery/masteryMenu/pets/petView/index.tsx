import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { Variants } from "shared/configs/pets";
import { StoreState } from "shared/rodux";
import { PetMasteryState } from "shared/rodux/petMastery";
import { PlayerIndexState } from "shared/rodux/playerIndex";

import { PetInfoView } from "./petInfo";
import { PetView } from "./petView";
import { PetChallengeProgress } from "./progress";

interface IndexEggViewProps extends IndexEggViewMappedProps {
	pet: number | undefined;
	currentVariant: Variants | undefined;
	displayChallenges: () => void;
	hideInfo: () => void;
}

interface IndexEggViewMappedProps {
	petMastery: PetMasteryState;
	index: PlayerIndexState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): IndexEggViewMappedProps {
	return {
		petMastery: state.petMastery,
		index: state.index,
	};
}

/**
 * @param props The properties of the roact component.
 * @param props.pet The id of the pet.
 * @param props.currentVariant The variant of the pet.
 * @param props.hideInfo A function to hide the info being displayed.
 * @returns A Roact component.
 */
export const IndexPetView = RoactRodux.connect(mapStateToProps)(
	hooks((props: IndexEggViewProps) => {
		if (props.pet === undefined) {
			return (
				<frame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(0, 131, 213)}
					Position={UDim2.fromScale(0.725, 0.55)}
					Size={UDim2.fromScale(0.5, 0.775)}
				>
					<uicorner CornerRadius={new UDim(0.1, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />
				</frame>
			);
		}

		const stringId = tostring(props.pet);
		if (stringId === undefined) {
			throw `Failed to convert pet id to string. Pet id: ${props.pet}`;
		}
		const petsIndex = props.index.pets.get(stringId);

		return (
			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(0, 131, 213)}
				Position={UDim2.fromScale(0.725, 0.55)}
				Size={UDim2.fromScale(0.5, 0.775)}
			>
				<uicorner CornerRadius={new UDim(0.1, 0)} />
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />

				<PetView
					pet={props.pet}
					currentVariant={props.currentVariant}
					hideInfo={props.hideInfo}
					isDiscovered={petsIndex !== undefined}
				/>
				<PetInfoView
					pet={props.pet}
					variant={props.currentVariant ?? "regular"}
					isDiscovered={petsIndex !== undefined}
				/>
				<PetChallengeProgress
					pet={props.pet}
					variant={props.currentVariant ?? "regular"}
					displayChallenges={props.displayChallenges}
					isDiscovered={petsIndex !== undefined}
				/>
			</frame>
		);
	}),
);
