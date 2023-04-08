import Roact from "@rbxts/roact";
import { playSFX, UIEngagement } from "client/util/playSound";
import { Variants } from "shared/configs/pets";
import { getPetData } from "shared/util/getPetData";

import { BaseFrame } from "../baseElements/baseFrame";
import { BaseImageButton } from "../baseElements/baseImageButton";
import { BaseImageLabel } from "../baseElements/baseImageLabel";
import { BaseTextLabel } from "../baseElements/baseTextLabel";
import { BaseUIStroke } from "../baseElements/baseUIStroke";
import { RarityGradient } from "../gradients/rarityGradient";
import { PetViewport } from "../viewports/petViewport";

interface PetFrameProps {
	petId: number;
	petLevel?: number;
	variant: Variants;
	displayBackground: boolean;
	isBillboard: boolean;
	shouldBlackout: boolean;
	shouldEquipBackgrund?: boolean;
	onActivated?: () => void;
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
/* eslint-disable jsdoc/require-jsdoc */
export function PetFrame(props: PetFrameProps): Roact.Element {
	const petData = getPetData(props.petId);

	const elementsToDisplay: Array<Roact.Element> = [];
	if (props.petLevel === undefined) {
		const petChance = (
			<BaseTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.9),
					Size: UDim2.fromScale(0.9, 0.3),
					Text: petData.rarity !== "Legendary" ? `${petData.chance}%` : "???",
					TextXAlignment: Enum.TextXAlignment.Right,
				}}
				stroke={{
					native: { Thickness: 2.5, Color: Color3.fromRGB(0, 74, 122) },
					isBillboard: props.isBillboard,
				}}
			>
				<RarityGradient Rarity={petData.rarity} />
			</BaseTextLabel>
		);

		const petRarity = (
			<BaseTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0),
					Size: UDim2.fromScale(0.9, 0.3),
					Text: petData.rarity,
				}}
				stroke={{
					native: { Thickness: 2.5, Color: Color3.fromRGB(0, 74, 122) },
					isBillboard: props.isBillboard,
				}}
			>
				<RarityGradient Rarity={petData.rarity} />
			</BaseTextLabel>
		);

		elementsToDisplay.push(petChance, petRarity);
	} else {
		const petLevel = (
			<BaseTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.9),
					Size: UDim2.fromScale(0.9, 0.3),
					Text: `Level: ${props.petLevel}`,
					TextXAlignment: Enum.TextXAlignment.Right,
				}}
				stroke={{
					native: { Thickness: 2.5, Color: Color3.fromRGB(0, 74, 122) },
					isBillboard: props.isBillboard,
				}}
			/>
		);

		elementsToDisplay.push(petLevel);
	}

	if (props.onActivated !== undefined) {
		return (
			<BaseFrame Size={UDim2.fromScale(0.85, 0.85)} LayoutOrder={props.petId}>
				<BaseImageButton
					native={{
						BackgroundTransparency: 0,
						BackgroundColor3: props.shouldEquipBackgrund ? Color3.fromRGB(85, 255, 127) : Color3.fromRGB(46, 115, 179),
						Size: UDim2.fromScale(0.925, 0.925),
						Image: "",
					}}
					events={{
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);

							if (props.onActivated !== undefined) {
								props.onActivated();
							}
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />

					<BaseUIStroke native={{ Thickness: 3, Transparency: 0.5 }} isBillboard={props.isBillboard} />
					<PetViewport petId={props.petId} variant={props.variant} shouldBlackout={props.shouldBlackout} />

					{elementsToDisplay}
				</BaseImageButton>
			</BaseFrame>
		);
	} else {
		return (
			<BaseFrame Size={UDim2.fromScale(0.9, 0.9)} LayoutOrder={props.petId}>
				<BaseImageLabel
					native={{
						BackgroundTransparency: 0,
						BackgroundColor3: Color3.fromRGB(46, 115, 179),
						Size: UDim2.fromScale(0.925, 0.925),
						Image: "",
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />

					<BaseUIStroke native={{ Thickness: 3, Transparency: 0.5 }} isBillboard={props.isBillboard} />
					<PetViewport petId={props.petId} variant={props.variant} shouldBlackout={props.shouldBlackout} />

					{elementsToDisplay}
				</BaseImageLabel>
			</BaseFrame>
		);
	}
} /* eslint-enable jsdoc/require-jsdoc */
