import Roact from "@rbxts/roact";
import { Variants } from "shared/configs/pets";
import { getPetData } from "shared/util/getPetData";

import { font, vec2Middle } from "../commonValues";
import { BaseUIStroke } from "./baseUIStroke";
import { PetViewport } from "./petViewport";
import { RarityGradient } from "./rarityGradient";

interface PetFrameProps {
	petId: number;
	variant: Variants;
	displayBackground: boolean;
	isBillboard: boolean;
	displayType: "stats" | "stored";
	shouldBlackout: boolean;
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

	const elementsToDisplay: Array<Roact.Element> = [];
	if (props.displayType === "stats") {
		elementsToDisplay.push(
			<>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.9)}
					Size={UDim2.fromScale(0.9, 0.3)}
					Text={petData.rarity !== "Legendary" ? `${petData.chance}%` : "???"}
					TextXAlignment={Enum.TextXAlignment.Right}
					TextScaled={true}
					Font={font}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<RarityGradient Rarity={petData.rarity} />
					<BaseUIStroke
						native={{ Thickness: 2.5, Color: Color3.fromRGB(0, 74, 122) }}
						isBillboard={props.isBillboard}
					/>
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0)}
					Size={UDim2.fromScale(0.9, 0.3)}
					Text={petData.rarity}
					TextScaled={true}
					Font={font}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<RarityGradient Rarity={petData.rarity} />
					<BaseUIStroke
						native={{ Thickness: 2.5, Color: Color3.fromRGB(0, 74, 122) }}
						isBillboard={props.isBillboard}
					/>
				</textlabel>
			</>,
		);
	}

	return (
		<frame BackgroundTransparency={1} LayoutOrder={props.petId}>
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(46, 115, 179)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.925, 0.925)}
				Image={""}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				<uicorner CornerRadius={new UDim(1, 0)} />
				<BaseUIStroke native={{ Thickness: 3, Transparency: 0.5 }} isBillboard={props.isBillboard} />
				<PetViewport petId={props.petId} variant={props.variant} shouldBlackout={props.shouldBlackout} />
				{elementsToDisplay}
			</imagelabel>
		</frame>
	);
}
