import Roact from "@rbxts/roact";
import { getPetDecal } from "client/util/getPetDecal";
import { EggName } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";

import { vec2Middle } from "../commonValues";
import { hooks } from "../hooks";

interface PetViewportProps {
	native: Partial<WritableInstanceProperties<ImageLabel>>;
	eggName: EggName;
	petId: number;
	variant: Variants;
}

/**
 * A viewport of a pet.
 *
 * @param props The properties of the pet viewport.
 * @param props.native The native properties of the viewport frame.
 * @param props.eggName The name of the egg the pet comes from.
 * @param props.petId The id of the pet being displayed.
 */
export const PetViewport = hooks((props: PetViewportProps) => {
	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.9, 0.9)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Image={getPetDecal(props.eggName, props.petId, props.variant)}
			ScaleType={Enum.ScaleType.Fit}
		/>
	);
});
