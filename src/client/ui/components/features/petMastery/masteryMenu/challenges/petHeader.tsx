// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { RarityGradient } from "client/ui/elements/gradients/rarityGradient";
import { hooks } from "client/ui/hooks";
import { Variants } from "shared/configs/pets";
import { StoreState } from "shared/rodux";
import { PlayerIndexState } from "shared/rodux/playerIndex";
import { getPetData } from "shared/util/getPetData";

interface ChallengesPetHeaderProps extends ChallengesPetHeaderMappedProps {
	pet: number;
	variant: Variants;
}

interface ChallengesPetHeaderMappedProps {
	index: PlayerIndexState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): ChallengesPetHeaderMappedProps {
	return {
		index: state.index,
	};
}

/**
 * The Header text of the pet mastery challenges window.
 */
export const ChallengesPetHeader = RoactRodux.connect(mapStateToProps)(
	hooks((props: ChallengesPetHeaderProps) => {
		const stringId = tostring(props.pet);
		if (stringId === undefined) {
			throw `Failed to get pet mastery data for pet ${props.pet}.`;
		}

		const petsIndex = props.index.pets.get(stringId);
		const petData = getPetData(props.pet);

		const variantHeader = props.variant === "radiant" ? "Radiant" : props.variant === "void" ? "Void" : "Regular";

		return (
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.575, 0.225),
					Size: UDim2.fromScale(0.8, 0.1),
					Text:
						petsIndex !== undefined ? `${variantHeader} "${petData.name}"s Mastery` : `${variantHeader} ???'s Mastery`,
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 1.6 } }}
			>
				<RarityGradient Rarity={petData.rarity} />
			</StrokeTextLabel>
		);
	}),
);
