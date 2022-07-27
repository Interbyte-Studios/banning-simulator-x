import Roact from "@rbxts/roact";
import assetIds from "shared/assets";
import { EggName } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";
import { getPetData } from "shared/util/getPetData";

import { udim2BottomRight, udim2Middle, uiTheme, vec2Middle } from "../commonValues";
import { BaseImageLabel } from "./baseImageLabel";
import { BaseTextLabel } from "./baseTextLabel";
import { BaseUIStroke } from "./baseUIStroke";
import { PetViewport } from "./petViewport";
import { RarityGradient } from "./rarityGradient";

interface PetFrameProps {
	eggName: EggName;
	petId: number;
	variant: Variants;
}

/**
 * An image frame which displays a viewport of a pet.
 *
 * @param props The properties of the pet frame.
 * @param props.eggName The name of the egg the pet comes from.
 * @param props.petId The id of the pet that is being displayed.
 * @param props.variant The variant of the pet.
 * @returns A roact component.
 */
export function PetFrame(props: PetFrameProps): Roact.Element {
	const petData = getPetData(props.eggName, props.petId);

	return (
		<frame
			AnchorPoint={vec2Middle}
			Position={udim2Middle}
			Size={udim2Middle}
			BackgroundTransparency={1}
			LayoutOrder={props.petId}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<BaseImageLabel Size={udim2BottomRight} Image={assetIds.images.buttons[uiTheme].templates.square.SquareButton}>
				<PetViewport
					native={{
						AnchorPoint: vec2Middle,
						Position: UDim2.fromScale(0.5, 0.5),
						Size: UDim2.fromScale(0.65, 0.65),
						BackgroundColor3: Color3.fromRGB(0, 0, 0),
						BackgroundTransparency: 1,
					}}
					eggName={props.eggName}
					petId={props.petId}
				/>
			</BaseImageLabel>
			<BaseTextLabel
				Position={UDim2.fromScale(0.3, 0.15)}
				Size={UDim2.fromScale(0.5, 0.4)}
				// todo: clarify whether or not this is allowed by ToS so long as the rarity and chance are displayed in the pet index.
				Text={petData.rarity !== "Legendary" ? `${petData.chance}%` : "???"}
			>
				<RarityGradient Rarity={petData.rarity} />
				<BaseUIStroke Thickness={3.2} />
			</BaseTextLabel>
		</frame>
	);
}
