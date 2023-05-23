// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { getPetImage } from "client/util/getPetImage";
import { Variants } from "shared/configs/pets";

import { hooks } from "../../hooks";
import { ImageLabel } from "../baseElements/imagelabels/image";

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
	const petImage = getPetImage(props.petId, props.variant);
	const petColor = props.shouldBlackout ? Color3.fromRGB(0, 0, 0) : Color3.fromRGB(255, 255, 255);

	return (
		<ImageLabel
			native={{
				Size: UDim2.fromScale(0.9, 0.9),
				Position: UDim2.fromScale(0.5, 0.5),
				Image: petImage,
				ImageColor3: petColor,
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</ImageLabel>
	);
});
