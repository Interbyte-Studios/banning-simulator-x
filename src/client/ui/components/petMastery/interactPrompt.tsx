// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { Players, RunService } from "@rbxts/services";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { getMagnitudeBetweenPlayerAndObject } from "shared/util/getDistanceFromObject";

/**
 * The distance in studs that the player must be near the vendor adornee to display the interaction prompt.
 */
const DISPLAY_DISTANCE = 25;

/**
 * Checks if the pet mastery vendor's interaction prompt should display.
 *
 * @param character The character to check the magnitude for.
 * @param adornee The adornee to determine the distance from.
 * @returns If the egg hud should display.
 */
function shouldDisplay(character: Model | undefined, adornee: BasePart): boolean {
	if (!character) {
		return false;
	}

	return (getMagnitudeBetweenPlayerAndObject(character, adornee) ?? math.huge) <= DISPLAY_DISTANCE;
}

/**
 * Displays a custom proximity prompt interface allowing the player to intract with the pet mastery component.
 */
export const PetMasteryInteractPrompt = hooks((props: { adornee: BasePart; displayPetMastery: () => void }, hooks) => {
	const { useState, useEffect } = hooks;
	const [isDisplayed, setDisplay] = useState(false);

	useEffect(() => {
		const player = Players.LocalPlayer;

		const connection = RunService.RenderStepped.Connect(() => {
			if (shouldDisplay(player.Character, props.adornee)) {
				if (!isDisplayed) {
					setDisplay(true);
				}
			} else {
				if (isDisplayed) {
					setDisplay(false);
				}
			}
		});

		return (): void => {
			connection.Disconnect();
		};
	});

	if (!isDisplayed) {
		return <></>;
	}

	return (
		<billboardgui
			Active={true}
			AlwaysOnTop={true}
			LightInfluence={0}
			Size={UDim2.fromScale(5, 5)}
			Adornee={props.adornee}
		>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0),
					Size: UDim2.fromScale(1.5, 0.4),
					Text: "Pet Mastery",
				}}
				stroke={{ native: { Thickness: 2 } }}
			/>
			<SpringImageButton
				native={{
					Image: assetIds.images.buttons["teal button"],
				}}
				size={{ maxSize: 0.7, minSize: 0.6 }}
				events={{
					/* eslint-disable jsdoc/require-jsdoc */
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);
						props.displayPetMastery();
					},
					/* eslint-enable jsdoc/require-jsdoc */
				}}
			>
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.9),
						Text: "C",
					}}
					stroke={{ native: { Thickness: 2 } }}
				/>
			</SpringImageButton>
		</billboardgui>
	);
});
