import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { vec2Middle } from "client/ui/commonValues";
import { PetViewport } from "client/ui/elements/petViewport";
import { hooks } from "client/ui/hooks";
import { StoreState } from "shared/rodux";
import { PetsState } from "shared/rodux/pets";

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

/**
 * Displays the player's pets.
 */
export const PetItems = RoactRodux.connect(petItemsMapStateToProps)(
	hooks((props: PetItemsMappedProps) => {
		const petsToDisplay: Array<Roact.Element> = [];

		for (const pet of props.pets) {
			const element = (
				<frame AnchorPoint={vec2Middle} BackgroundTransparency={0} BackgroundColor3={Color3.fromRGB(255, 255, 255)}>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(0.075, 0)} />
					<uistroke Thickness={3} Transparency={0.5} />
                    <PetViewport eggName={} />
				</frame>
			);

			petsToDisplay.push(element);
		}

		return (
			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.965, 0.755)}
				Position={UDim2.fromScale(0.5, 0.495)}
			>
				<uigridlayout CellPadding={UDim2.fromScale(0.025, 0.065)} CellSize={UDim2.fromScale(0.145, 0.3)} />
				{petsToDisplay}
			</frame>
		);
	}),
);
