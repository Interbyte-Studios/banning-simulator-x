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
const DISPLAY_DISTANCE = 120;

/**
 * Checks if the promptdisplay for a given `character` and `adornee`.
 *
 * @param character The character to check the magnitude for.
 * @param adornee The adornee to determine the distance from.
 * @returns If the prompt should display.
 */
export function shouldDisplay(character: Model | undefined, adornee: BasePart): boolean {
	if (!character) {
		return false;
	}

	return (getMagnitudeBetweenPlayerAndObject(character, adornee) ?? math.huge) <= DISPLAY_DISTANCE;
}

/**
 * Displays a custom proximity prompt interface allowing the player to intract with the weapon shop.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const WeaponShopInteractPrompt = hooks((props: { displayShop: () => void }, hooks) => {
	const { useState, useEffect } = hooks;
	const [isDisplayed, setDisplay] = useState(false);

	useEffect(() => {
		const player = Players.LocalPlayer;

		const connection = RunService.RenderStepped.Connect(() => {
			debug.profilebegin("weaponShopInteractPrompt");
			if (shouldDisplay(player.Character, Workspace.interactions.worlds["Ban Land"].weaponShop.InteractPrompt)) {
				if (!isDisplayed) {
					setDisplay(true);
				}
			} else {
				if (isDisplayed) {
					setDisplay(false);
				}
			}
			debug.profileend();
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
			Size={UDim2.fromScale(12, 10)}
			StudsOffsetWorldSpace={new Vector3(0, 5, 0)}
			MaxDistance={10000000}
			Adornee={Workspace.interactions.worlds["Ban Land"].weaponShop.InteractPrompt}
		>
			<SpringImageButton
				native={{
					Position: UDim2.fromScale(0.5, 0.2),
					Image: assetIds.images.vectors.Hammer,
				}}
				size={{ minSize: 0.4, maxSize: 0.5 }}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</SpringImageButton>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.5),
					Size: UDim2.fromScale(1.5, 0.25),
					FontFace: new Font("FredokaOne", Enum.FontWeight.Regular, Enum.FontStyle.Italic),
					Text: "Weapon Shop",
					TextColor3: Color3.fromRGB(255, 255, 255),
				}}
				stroke={{ native: { Thickness: 3.5, Color: Color3.fromRGB(0, 0, 0) } }}
			>
				<uigradient
					Rotation={90}
					Color={
						new ColorSequence([
							new ColorSequenceKeypoint(0, Color3.fromRGB(0, 255, 255)),
							new ColorSequenceKeypoint(1, Color3.fromRGB(0, 85, 255)),
						])
					}
				/>
			</StrokeTextLabel>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.7),
					Size: UDim2.fromScale(1.1, 0.2),
					FontFace: new Font("FredokaOne", Enum.FontWeight.Regular, Enum.FontStyle.Italic),
					Text: "Buy new weapons!",
				}}
				stroke={{ native: { Thickness: 3.5, Color: Color3.fromRGB(0, 0, 0) } }}
			/>

			<SpringImageButton
				native={{
					Position: UDim2.fromScale(0.5, 0.95),
					Image: assetIds.images.ui.index.Claim,
				}}
				size={{ minSize: 0.4, maxSize: 0.5 }}
				events={{
					Activated: (): void => {
						playSFX(UIEngagement.MajorEngagement);
						props.displayShop();
					},
				}}
			>
				<uiaspectratioconstraint AspectRatio={2} />
			</SpringImageButton>
		</billboardgui>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
