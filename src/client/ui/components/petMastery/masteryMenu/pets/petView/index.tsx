import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";

import { PetNameView } from "./petName";
import { PetView } from "./petView";

interface IndexEggViewProps {
	pet: number | undefined;
	hideInfo: () => void;
}

/**
 * @param props The properties of the roact component.
 * @param props.pet The id of the pet..
 * @param props.hideInfo A function to hide the info being displayed.
 * @returns A Roact component.
 */
export function IndexPetView(props: IndexEggViewProps): Roact.Element {
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
				<BaseUIStroke Thickness={2} Color={Color3.fromRGB(0, 100, 163)} />
			</frame>
		);
	}

	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={0}
			BackgroundColor3={Color3.fromRGB(0, 131, 213)}
			Position={UDim2.fromScale(0.725, 0.55)}
			Size={UDim2.fromScale(0.5, 0.775)}
		>
			<uicorner CornerRadius={new UDim(0.1, 0)} />
			<BaseUIStroke Thickness={2} Color={Color3.fromRGB(0, 100, 163)} />

			<PetView pet={props.pet} hideInfo={props.hideInfo} />
			<PetNameView pet={props.pet} />
		</frame>
	);
}
