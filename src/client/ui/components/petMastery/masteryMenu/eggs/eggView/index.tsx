import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { EggName } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";
import { StoreState } from "shared/rodux";
import { PlayerIndexState } from "shared/rodux/playerIndex";

import { EggCostView } from "./eggCost";
import { EggNameView } from "./eggName";
import { EggView } from "./eggView";
import { RadiantEggProgress } from "./progress/radiant";
import { RegularEggProgress } from "./progress/regular";
import { VoidEggProgress } from "./progress/void";

interface IndexEggViewProps extends IndexEggViewMappedProps {
	egg: EggName | undefined;
	displayPets: (variant: Variants) => void;
	hideInfo: () => void;
}

interface IndexEggViewMappedProps {
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
		index: state.index,
	};
}

/**
 * @param props The properties of the roact component.
 * @param props.egg The name of the egg.
 * @param props.hideInfo A function to hide the info being displayed.
 * @returns A Roact component.
 */
export const IndexEggView = RoactRodux.connect(mapStateToProps)(
	hooks((props: IndexEggViewProps) => {
		if (props.egg === undefined) {
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

		const eggsIndex = props.index.eggs.get(props.egg);

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

				<EggView egg={props.egg} hideInfo={props.hideInfo} isDiscovered={eggsIndex !== undefined} />
				<EggNameView egg={props.egg} isDiscovered={eggsIndex !== undefined} />
				<EggCostView egg={props.egg} />
				<RegularEggProgress egg={props.egg} displayPets={props.displayPets} />
				<VoidEggProgress egg={props.egg} displayPets={props.displayPets} />
				<RadiantEggProgress egg={props.egg} displayPets={props.displayPets} />
			</frame>
		);
	}),
);
