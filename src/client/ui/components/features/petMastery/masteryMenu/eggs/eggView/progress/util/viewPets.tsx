// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { uiClaimButtonStrokeColor } from "client/ui/commonValues";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { Notification } from "client/ui/elements/common/notification";
import { hooks } from "client/ui/hooks";
import { getPetMasteryUnclaimedChallenges } from "client/util/getPetMasteryUnclaimedChallenges";
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
		const unseenChallenges = getPetMasteryUnclaimedChallenges(props.egg, props.variant);

		return (
			<SpringImageButton
				native={{
					Position: props.position,
					Image: assetIds.images.ui.index.view,
				}}
				size={{ minSize: 0.25, maxSize: 0.285 }}
				events={{
					/* eslint-disable jsdoc/require-jsdoc */
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);
						props.displayPets(props.variant);
					},
					/* eslint-enable jsdoc/require-jsdoc */
				}}
			>
				<uiaspectratioconstraint AspectRatio={2} />
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.8, 0.8),
						Text: "Pets",
					}}
					stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
				/>
				{unseenChallenges > 0 && (
					<Notification
						amount={unseenChallenges}
						position={UDim2.fromScale(0.95, 0)}
						size={UDim2.fromScale(0.55, 0.55)}
					/>
				)}
			</SpringImageButton>
		);
	},
);
