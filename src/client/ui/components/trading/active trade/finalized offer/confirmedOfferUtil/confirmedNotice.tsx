import Roact from "@rbxts/roact";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";

/**
 * Shows that the other player has confirmed their offer.
 *
 * @param props The properties of the component.
 * @param props.lower Whether or not the component should be rendered in the lower half of the screen.
 * @returns The Roact element to render.
 */
export const ConfirmedNotice = (props: { lower?: boolean }): Roact.Element => {
	return (
		<StrokeTextLabel
			native={{
				Position: props.lower ? UDim2.fromScale(0.5, 0.925) : UDim2.fromScale(0.5, 0.8),
				Size: UDim2.fromScale(0.8, 0.1),
				Text: "Confirmed",
				TextColor3: Color3.fromRGB(85, 255, 127),
			}}
			stroke={{ native: { Color: Color3.fromRGB(45, 136, 66), Thickness: 2 } }}
		/>
	);
};
