import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { EggName } from "shared/configs/eggs";
import { StoreState } from "shared/rodux";
import { PetMasteryState } from "shared/rodux/petMastery";
import { getEggData } from "shared/util/getEggData";

interface ProgressBarProps extends RegularEggProgressMappedProps {
	egg: EggName;
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

		let totalPets = 0;
		let completedPets = 0;
		for (const [, data] of pairs(eggData.pets)) {
			totalPets += 1;

			const petsMasteryIndex = props.petMastery.get(data.id);
			if (petsMasteryIndex === undefined) {
				continue;
			}

			if (petsMasteryIndex.regular.claimed === false) {
				continue;
			}

			completedPets += 1;
		}

		const completionPercentage = completedPets / totalPets;
		const completionBarComponent: Array<Roact.Element> = [];

		if (completionPercentage > 0) {
			completionBarComponent.push(
				<frame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(130, 245, 166)}
					Size={UDim2.fromScale(completionPercentage, 1)}
					Position={UDim2.fromScale(0, 0.5)}
				>
					<uicorner CornerRadius={new UDim(0.4, 0)} />
				</frame>,
			);
		}

		return (
			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(250, 158, 158)}
				Size={UDim2.fromScale(0.9, 0.06)}
				Position={props.position}
			>
				<uicorner CornerRadius={new UDim(0.4, 0)} />
				<BaseUIStroke native={{ Thickness: 2 }} />

				{completionBarComponent}

				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Size={UDim2.fromScale(1, 1)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Font={font}
					Text={`${completionPercentage * 100}%`}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
				>
					<BaseUIStroke native={{ Thickness: 2 }} />
				</textlabel>
			</frame>
		);
	}),
);
