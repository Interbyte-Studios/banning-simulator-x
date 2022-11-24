import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { RarityGradient } from "client/ui/elements/rarityGradient";
import { Variants } from "shared/configs/pets";
import { getPetData } from "shared/util/getPetData";

/**
 * @param props The properties of the roact component.
 * @param props.pet The id of the pet.
 * @param props.variant The variant of the pet.
 * @returns A Roact component.
 */
export function PetInfoView(props: { pet: number; variant: Variants }): Roact.Element {
	const petData = getPetData(props.pet);

	return (
		<>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.7, 0.075)}
				Size={UDim2.fromScale(0.5, 0.1)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={petData.name}
				Font={font}
			>
				<RarityGradient Rarity={petData.rarity} />
				<BaseUIStroke native={{ Thickness: 3 }} />
			</textlabel>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.7, 0.19)}
				Size={UDim2.fromScale(0.5, 0.1)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={petData.rarity}
				Font={font}
			>
				<RarityGradient Rarity={petData.rarity} />
				<BaseUIStroke native={{ Thickness: 3 }} />
			</textlabel>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.7, 0.3)}
				Size={UDim2.fromScale(0.5, 0.1)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={props.variant !== "radiant" ? `${tostring(petData.chance)}% Hatch Chance` : `Cannot be hatched.`}
				Font={font}
			>
				<BaseUIStroke native={{ Thickness: 1.75 }} />
			</textlabel>
		</>
	);
}
