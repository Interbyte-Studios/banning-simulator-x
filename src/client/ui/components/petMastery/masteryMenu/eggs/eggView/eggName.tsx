import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { EggName } from "shared/configs/eggs";

/**
 * @param props The properties of the roact component.
 * @param props.egg The egg name to display.
 * @returns A Roact component.
 */
export function EggNameView(props: { egg: EggName }): Roact.Element {
	return (
		<textlabel
			AnchorPoint={vec2Middle}
			Position={UDim2.fromScale(0.7, 0.075)}
			Size={UDim2.fromScale(0.5, 0.1)}
			BackgroundTransparency={1}
			TextScaled={true}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			Text={props.egg}
			Font={font}
		>
			<BaseUIStroke native={{ Thickness: 3 }} />
		</textlabel>
	);
}
