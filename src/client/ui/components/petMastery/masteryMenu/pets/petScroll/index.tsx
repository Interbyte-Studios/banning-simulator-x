import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { EggName } from "shared/configs/eggs";
import { getEggData } from "shared/util/getEggData";

import { IndexPetCard } from "./petCard";

/**
 * A scroll menu displaying the pets of the egg the player is viewing in the pet mastery component.
 *
 * @param props The properties of the Roact component.
 * @param props.displayPet A function to display the pets info in the view area of the component.
 * @param props.currentPet The pet currently being displayed, if any.
 * @param props.egg The egg the player is currently viewing.
 * @returns A Roact component.
 */
export function IndexPetScroll(props: {
	egg: EggName;
	currentPet: number | undefined;
	displayPet: (petName: number | undefined) => void;
}): Roact.Element {
	const eggData = getEggData(props.egg);
	const pets = Object.values(eggData.pets).map((pet) => pet);

	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.225, 0.55)}
			Size={UDim2.fromScale(0.4, 0.775)}
		>
			<uilistlayout
				SortOrder={Enum.SortOrder.LayoutOrder}
				HorizontalAlignment={Enum.HorizontalAlignment.Right}
				Padding={new UDim(0.05, 0)}
			/>
			{pets.map((petData) => {
				return <IndexPetCard pet={petData.id} displayPet={props.displayPet} currentPet={props.currentPet} />;
			})}
		</frame>
	);
}
