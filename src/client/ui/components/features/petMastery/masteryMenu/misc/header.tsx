import Roact from "@rbxts/roact";
import { uiHeaderStrokeColor } from "client/ui/commonValues";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";

/**
 * The "Header" text for the Pet Mastery component.
 *
 * @returns A roact element.
 */
export function PetMasteryIndexHeader(): Roact.Element {
	return (
		<StrokeTextLabel
			native={{
				Position: UDim2.fromScale(0.505, 0.07),
				Size: UDim2.fromScale(0.375, 0.1),
				Text: "Pet Mastery",
			}}
			stroke={{ native: { Thickness: 2, Color: uiHeaderStrokeColor } }}
		/>
	);
}
