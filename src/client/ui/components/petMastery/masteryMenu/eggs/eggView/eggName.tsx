import Roact from "@rbxts/roact";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { EggName } from "shared/configs/eggs";

/**
 * @param props The properties of the roact component.
 * @param props.egg The egg name to display.
 * @param props.isDiscovered Whether or not the egg's been discovered.
 * @returns A Roact component.
 */
export function EggNameView(props: { egg: EggName; isDiscovered: boolean }): Roact.Element {
	return (
		<StrokeTextLabel
			native={{
				Position: UDim2.fromScale(0.7, 0.075),
				Size: UDim2.fromScale(0.5, 0.1),
				Text: props.isDiscovered ? props.egg : "???",
			}}
			stroke={{ native: { Thickness: 3 } }}
		/>
	);
}
