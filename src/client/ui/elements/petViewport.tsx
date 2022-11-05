import Roact from "@rbxts/roact";
import { getPetDecal } from "client/util/getPetDecal";
import { Variants } from "shared/configs/pets";

import { vec2Middle } from "../commonValues";
import { hooks } from "../hooks";

interface PetViewportProps {
	native: Partial<WritableInstanceProperties<ImageLabel>>;
	petId: number;
	variant: Variants;
}

/**
 * A viewport of a pet.
 *
 * @param props The properties of the pet viewport.
 * @param props.native The native properties of the viewport frame.
 * @param props.petId The id of the pet being displayed.
 */
export const PetViewport = hooks((props: PetViewportProps) => {
	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.9, 0.9)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Image={getPetDecal(props.petId, props.variant)}
			ScaleType={Enum.ScaleType.Fit}
		/>
	);
});
