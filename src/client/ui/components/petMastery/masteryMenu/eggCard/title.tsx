import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { EggName } from "shared/configs/eggs";

/**
 * @param props The properties of the roact component.
 * @param props.eggName The name of the egg.
 * @returns A roact component displaying the name of the specified egg.
 */
export function EggTitle(props: { eggName: EggName }): Roact.Element {
	return (
		<textlabel
			AnchorPoint={vec2Middle}
			Position={UDim2.fromScale(0.6, 0.2)}
			Size={UDim2.fromScale(0.7, 0.3)}
			BackgroundTransparency={1}
			TextScaled={true}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			Text={`${props.eggName} Egg`}
			Font={font}
		>
			<BaseUIStroke Thickness={3} />
		</textlabel>
	);
}
