// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { Players, RunService, Workspace } from "@rbxts/services";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { getMagnitudeBetweenPlayerAndObject } from "shared/util/getDistanceFromObject";

/**
 * The distance in studs that the player must be near the egg adornee to activate the HUD.
 */
const DISPLAY_DISTANCE = 25;

/**
 * Checks if the egg hud should display for a given `character` and `adornee`.
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
 * Displays a custom proximity prompt interface allowing the player to intract with the talisman tower.
 */
export const TalismanTowerInteractPrompt = hooks((props: { displayShop: () => void }, hooks) => {
	const { useState, useEffect } = hooks;
	const [isDisplayed, setDisplay] = useState(false);

	useEffect(() => {
		const player = Players.LocalPlayer;

		const connection = RunService.RenderStepped.Connect(() => {
			if (shouldDisplay(player.Character, Workspace.interactions.worlds["Ban Land"].talismanTower.InteractPrompt)) {
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
	} else {
		return (
			<billboardgui
				Active={true}
				AlwaysOnTop={true}
				LightInfluence={0}
				Size={UDim2.fromScale(5, 5)}
				Adornee={Workspace.interactions.worlds["Ban Land"].talismanTower.InteractPrompt}
			>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0),
						Size: UDim2.fromScale(1.5, 0.4),
						Text: "Talisman Tower",
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(25, 147, 170) } }}
				/>
				<SpringImageButton
					native={{
						Image: assetIds.images.buttons["teal button"],
					}}
					size={{ minSize: 0.6, maxSize: 0.7 }}
					events={{
						/* eslint-disable jsdoc/require-jsdoc */
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);
							props.displayShop();
						},
						/* eslint-enable jsdoc/require-jsdoc */
					}}
				>
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.9, 0.9),
							Text: "X",
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(25, 147, 170) } }}
					/>
				</SpringImageButton>
			</billboardgui>
		);
	}
});
