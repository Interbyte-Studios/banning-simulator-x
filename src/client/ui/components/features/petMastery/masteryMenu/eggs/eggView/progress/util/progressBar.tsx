import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { EggName } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";
import { StoreState } from "shared/rodux";
import { PetMasteryState } from "shared/rodux/petMastery";
import { getEggData } from "shared/util/getEggData";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";

interface ProgressBarProps extends RegularEggProgressMappedProps {
	egg: EggName;
	variant: Variants;
	position: UDim2;
}

interface RegularEggProgressMappedProps {
	petMastery: PetMasteryState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): RegularEggProgressMappedProps {
	return {
		petMastery: state.petMastery,
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
		const eggData = getEggData(props.egg);

		let totalChallenges = 0;
		let completedChallenges = 0;
		for (const [, data] of pairs(eggData.pets)) {
			if (data.rarity === "Primordial" || data.rarity === "Secret") {
				continue;
			}

			if (props.variant === "regular") {
				totalChallenges += 2;
			} else if (props.variant === "void") {
				totalChallenges += 3;
			} else if (props.variant === "radiant") {
				totalChallenges += 2;
			}

			const petsMasteryIndex = props.petMastery.find((mastery) => mastery.id === data.id);
			if (petsMasteryIndex === undefined) {
				continue;
			}
			switch (props.variant) {
				case "regular": {
					const masteryData = petsMasteryIndex.mastery[props.variant];
					if (masteryData.hatchClaimed) {
						completedChallenges += 1;
					}

					if (masteryData.maxLevelClaimed) {
						completedChallenges += 1;
					}
					break;
				}
				case "void": {
					const masteryData = petsMasteryIndex.mastery[props.variant];

					if (masteryData.hatchClaimed) {
						completedChallenges += 1;
					}

					if (masteryData.maxLevelClaimed) {
						completedChallenges += 1;
					}

					if (masteryData.fuseClaimed) {
						completedChallenges += 1;
					}

					break;
				}
				case "radiant": {
					const masteryData = petsMasteryIndex.mastery[props.variant];

					if (masteryData.maxLevelClaimed) {
						completedChallenges += 1;
					}

					if (masteryData.fuseClaimed) {
						completedChallenges += 1;
					}
					break;
				}
			}
		}

		let completionPercentage = completedChallenges / totalChallenges;
		const completionBarComponent: Array<Roact.Element> = [];

		if (completionPercentage > 0) {
			if (completionPercentage > 1) {
				completionPercentage = 1;
			}

			const completionElement = (
				<BaseFrame
					AnchorPoint={new Vector2(0, 0)}
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(130, 245, 166)}
					Size={UDim2.fromScale(completionPercentage, 1)}
					Position={UDim2.fromScale(0, 0)}
				>
					<uicorner CornerRadius={new UDim(0.4, 0)} />
				</BaseFrame>
			);

			completionBarComponent.push(completionElement);
		}

		return (
			<BaseFrame
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(250, 158, 158)}
				Size={UDim2.fromScale(0.9, 0.06)}
				Position={props.position}
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
