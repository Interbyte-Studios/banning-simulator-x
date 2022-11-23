import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";

/**
 * The "Header" text for the Pet Mastery component.
 *
 * @returns A roact element.
 */
export function PetMasteryIndexHeader(): Roact.Element {
	return (
		<textlabel
			AnchorPoint={vec2Middle}
			Position={UDim2.fromScale(0.51, 0.06)}
			Size={UDim2.fromScale(0.375, 0.1)}
			BackgroundTransparency={1}
			TextScaled={true}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			Text={"Pet Mastery"}
			Font={font}
		>
			<BaseUIStroke Thickness={3} />
		</textlabel>
	);
}
