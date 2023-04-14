import Roact from "@rbxts/roact";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/**
 * A button that allows the player to view the pets of a specified variant of a specified egg.
 *
 * @param props The props for the component.
 * @param props.displayChallenges The function to call when the button is pressed.
 * @returns The element to render.
 */
export const ViewPetChallenges = (props: { displayChallenges: () => void }): Roact.Element => {
	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.5, 0.925),
				Image: assetIds.images.ui.index["view challenges"],
			}}
			size={{ minSize: 0.09, maxSize: 0.1 }}
			events={{
				/* eslint-disable jsdoc/require-jsdoc */
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.displayChallenges();
				},
				/* eslint-enable jsdoc/require-jsdoc */
			}}
		>
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.9, 0.9),
					Text: "Challenges",
				}}
				stroke={{ native: { Thickness: 2 } }}
			/>
		</SpringImageButton>
	);
};
