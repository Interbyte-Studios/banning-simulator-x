import Roact from "@rbxts/roact";
import assetIds from "shared/assets";
import { EggName } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";
import { getPetData } from "shared/util/getPetData";

import { udim2BottomRight, udim2Middle, vec2Middle } from "../commonValues";
import { BaseTextLabel } from "./baseTextLabel";
import { BaseUIStroke } from "./baseUIStroke";
import { PetViewport } from "./petViewport";
import { RarityGradient } from "./rarityGradient";

interface PetFrameProps {
	eggName: EggName;
	petId: number;
	variant: Variants;
	displayBackground: boolean;
	size?: UDim2;
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
	const petData = getPetData(props.petId);

	return (
		<frame
			BackgroundTransparency={1}
			AnchorPoint={vec2Middle}
			Position={udim2Middle}
			Size={props.size ? props.size : udim2Middle}
			LayoutOrder={props.petId}
		>
			<uiaspectratioconstraint AspectRatio={1.4} />
			<imagelabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={udim2BottomRight}
				Image={props.displayBackground ? assetIds.images.ui.egg["pet frame"] : ""}
			>
				<PetViewport
					native={{
						AnchorPoint: vec2Middle,
						Position: UDim2.fromScale(0.5, 0.5),
						Size: UDim2.fromScale(0.9, 0.9),
						BackgroundColor3: Color3.fromRGB(0, 0, 0),
						BackgroundTransparency: 1,
					}}
					eggName={props.eggName}
					petId={props.petId}
					isVoid={props.variant === "void"}
				/>
			</imagelabel>
			<BaseTextLabel
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.9)}
				Size={UDim2.fromScale(0.9, 0.3)}
				Text={petData.rarity !== "Legendary" ? `${petData.chance}%` : "???"}
				TextXAlignment={Enum.TextXAlignment.Right}
			>
				<BaseUIStroke Thickness={2.5} />
			</BaseTextLabel>
			<BaseTextLabel
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0)}
				Size={UDim2.fromScale(0.9, 0.3)}
				Text={petData.rarity}
			>
				<RarityGradient Rarity={petData.rarity} />
				<BaseUIStroke Thickness={2.5} />
			</BaseTextLabel>
		</frame>
	);
}
