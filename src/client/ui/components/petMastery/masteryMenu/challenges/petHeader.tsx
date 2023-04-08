import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
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
		const petsIndex = props.index.pets.get(props.pet);
		const petData = getPetData(props.pet);

		const variantHeader = props.variant === "radiant" ? "Radiant" : props.variant === "void" ? "Void" : "Regular";

		return (
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.575, 0.225)}
				Size={UDim2.fromScale(0.8, 0.1)}
				Font={font}
				Text={
					petsIndex !== undefined ? `${variantHeader} "${petData.name}"s Mastery` : `${variantHeader} ???'s Mastery`
				}
				TextScaled={true}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<RarityGradient Rarity={petData.rarity} />
				<BaseUIStroke native={{ Thickness: 1.6 }} />
			</textlabel>
		);
	}),
);
