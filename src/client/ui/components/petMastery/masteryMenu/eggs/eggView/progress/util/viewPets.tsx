// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { EggName } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";

/**
 * A button that allows the player to view the pets of a specified variant of a specified egg.
 */
export const ViewPets = hooks(
	(props: {
		egg: EggName;
		variant: Variants;
		position: UDim2;
		displayPets: (variant: Variants) => void;
	}): Roact.Element => {
		return (
			<SpringImageButton
				native={{
					Position: props.position,
					Image: assetIds.images.ui.index.view,
				}}
				size={{ minSize: 0.09, maxSize: 0.1 }}
				events={{
					/* eslint-disable jsdoc/require-jsdoc */
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);
						props.displayPets(props.variant);
					},
					/* eslint-enable jsdoc/require-jsdoc */
				}}
			>
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(1, 1),
						Text: "Pets",
					}}
					stroke={{ native: { Thickness: 2 } }}
				/>
			</SpringImageButton>
		);
	},
);
