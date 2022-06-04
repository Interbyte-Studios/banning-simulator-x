import Roact from "@rbxts/roact";
import assetIds from "shared/assets";
import { EggNames } from "shared/configs/eggs";
import { getPetData } from "shared/util/getPetData";

import { udim2BottomRight, udim2Middle, uiTheme } from "../commonValues";
import { BaseImageLabel } from "./baseImageLabel";
import { BaseTextLabel } from "./baseTextLabel";
import { BaseUIStroke } from "./baseUIStroke";
import { RarityGradient } from "./rarityGradient";

interface PetFrameProps {
	eggName: EggNames;
	petId: number;
}

/* eslint-disable jsdoc/require-jsdoc */
export function PetFrame(props: PetFrameProps): Roact.Element {
	const petData = getPetData(props.eggName, props.petId);

	return (
		<frame BackgroundTransparency={1} ZIndex={props.petId}>
			<uiaspectratioconstraint AspectRatio={1} />
			<BaseImageLabel Size={udim2BottomRight} Image={assetIds.images.buttons[uiTheme].templates.square.SquareButton}>
				<BaseImageLabel Size={udim2Middle} Image={"http://www.roblox.com/asset/?id=9125808056"} />
			</BaseImageLabel>
			<BaseTextLabel
				Position={new UDim2(0.3, 0, 0.15, 0)}
				Size={new UDim2(0.5, 0, 0.4, 0)}
				Text={petData.petData.rarity !== "Legendary" ? `${petData.petData.chance}%` : "???"}
			>
				<RarityGradient Rarity={petData.petData.rarity} />
				<BaseUIStroke Thickness={3.2} />
			</BaseTextLabel>
		</frame>
	);
}
