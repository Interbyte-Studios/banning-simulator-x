import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { PET_MASTERY_REQUIREMENTS } from "shared/configs/petMastery";
import { Variants } from "shared/configs/pets";
import { StoreState } from "shared/rodux";
import { PlayerIndexState } from "shared/rodux/playerIndex";
import { getPetData } from "shared/util/getPetData";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";

interface ProgressBarProps extends RegularEggProgressMappedProps {
	pet: number;
	variant: Variants;
}

interface RegularEggProgressMappedProps {
	index: PlayerIndexState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): RegularEggProgressMappedProps {
	return {
		index: state.index,
	};
}

/**
 * @param props The properties of the Roact component.
 * @param props.egg The name of the egg to check the progress of.
 * @param props.position The position of the Roact component.
 * @returns A Roact component.
 */
export const ProgressBar = RoactRodux.connect(mapStateToProps)(
	hooks((props: ProgressBarProps) => {
		const petsIndex = props.index.pets.get(props.pet);

		const petData = getPetData(props.pet);
		const masteryRequirements = PET_MASTERY_REQUIREMENTS[petData.rarity][props.variant];

		const completionBarComponent: Array<Roact.Element> = [];

		let potentiallyFinishedChallenges = 0;
		const totalChallenges = props.variant === "radiant" || props.variant === "regular" ? 2 : 3;
		if (petsIndex !== undefined) {
			if (props.variant === "regular") {
				if (petsIndex.hatched.regular >= masteryRequirements.hatch) {
					potentiallyFinishedChallenges += 1;
				}

				if (petsIndex.maxLevel.regular.cachedMaxLevel.size() >= masteryRequirements.maxLevel) {
					potentiallyFinishedChallenges += 1;
				}
			} else if (props.variant === "void") {
				if (petsIndex.hatched.void >= masteryRequirements.hatch) {
					potentiallyFinishedChallenges += 1;
				}

				if (petsIndex.maxLevel.void.cachedMaxLevel.size() >= masteryRequirements.maxLevel) {
					potentiallyFinishedChallenges += 1;
				}

				if (petsIndex.fused.void >= masteryRequirements.fuse) {
					potentiallyFinishedChallenges += 1;
				}
			} else if (props.variant === "radiant") {
				if (petsIndex.maxLevel.radiant.cachedMaxLevel.size() >= masteryRequirements.maxLevel) {
					potentiallyFinishedChallenges += 1;
				}

				if (petsIndex.fused.radiant >= masteryRequirements.fuse) {
					potentiallyFinishedChallenges += 1;
				}
			}
		}

		const completionPercentage = potentiallyFinishedChallenges / totalChallenges ?? 0;
		if (completionPercentage > 0) {
			completionBarComponent.push(
				<BaseFrame
					AnchorPoint={new Vector2(0, 0)}
					BackgroundTransparency={0}
					Position={UDim2.fromScale(0, 0)}
					BackgroundColor3={Color3.fromRGB(130, 245, 166)}
					Size={UDim2.fromScale(completionPercentage, 1)}
				>
					<uicorner CornerRadius={new UDim(0.4, 0)} />
				</BaseFrame>,
			);
		}

		return (
			<BaseFrame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(250, 158, 158)}
				Size={UDim2.fromScale(0.9, 0.06)}
				Position={UDim2.fromScale(0.5, 0.825)}
			>
				<uicorner CornerRadius={new UDim(0.4, 0)} />
				<BaseUIStroke native={{ Thickness: 2 }} />

				{completionBarComponent}

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(1, 1),
						Text: `${statsAbbreviator.numberToString(completionPercentage * 100)}%`,
					}}
					stroke={{ native: { Thickness: 2 } }}
				/>
			</BaseFrame>
		);
	}),
);
