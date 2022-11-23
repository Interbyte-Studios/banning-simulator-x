import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { getPetData } from "shared/util/getPetData";

/**
 * @param props The properties of the roact component.
 * @param props.pet The id of the pet.
 * @returns A Roact component.
 */
export function PetNameView(props: { pet: number }): Roact.Element {
	const petData = getPetData(props.pet);

	return (
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
			<BaseUIStroke Thickness={3} />
		</textlabel>
	);
}
