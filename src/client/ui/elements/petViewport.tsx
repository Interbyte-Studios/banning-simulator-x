import Roact from "@rbxts/roact";
import { getPetImage } from "client/util/getPetImage";
import { Variants } from "shared/configs/pets";

import { vec2Middle } from "../commonValues";
import { hooks } from "../hooks";

interface PetViewportProps {
	petId: number;
	variant: Variants;
	shouldBlackout: boolean;
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
			Image={getPetImage(props.petId, props.variant)}
			ImageColor3={props.shouldBlackout ? Color3.fromRGB(0, 0, 0) : Color3.fromRGB(255, 255, 255)}
			ScaleType={Enum.ScaleType.Fit}
		/>
	);
});
