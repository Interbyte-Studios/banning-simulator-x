import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { Players, RunService, Workspace } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
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
	return true;

	/*

	if (!character) {
		return false;
	}

	return (getMagnitudeBetweenPlayerAndObject(character, adornee) ?? math.huge) <= DISPLAY_DISTANCE;

	*/
}

/**
 * Displays a custom proximity prompt interface allowing the player to intract with the talisman tower.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const TalismanTowerInteractPrompt = hooks((props: { visible: boolean; displayShop: () => void }, hooks) => {
	if (!props.visible) {
		return <></>;
	}

	const { useState, useEffect } = hooks;
	const [isDisplayed, setDisplay] = useState(true);

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
	}

	const maximizedSize = 0.7;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const minimizedSize = 0.6;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<billboardgui
			Active={true}
			AlwaysOnTop={true}
			LightInfluence={0}
			Size={UDim2.fromScale(5, 5)}
			Adornee={Workspace.interactions.worlds["Ban Land"].talismanTower.InteractPrompt}
		>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0)}
				Size={UDim2.fromScale(1.5, 0.4)}
				Text={"Talisman Tower"}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
				Font={font}
			>
				<BaseUIStroke Thickness={2} />
			</textlabel>
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={binding.map((value) => {
					return UDim2.fromScale(value, value);
				})}
				Image={assetIds.images.buttons["teal button"]}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: (): void => props.displayShop(),
					MouseEnter: (): void => motor.setGoal(minimizedSpring),
					MouseLeave: (): void => motor.setGoal(maximizedSpring),
				}}
			>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.9, 0.9)}
					Text={"X"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					Font={font}
				>
					<BaseUIStroke Thickness={2} />
				</textlabel>
			</imagebutton>
		</billboardgui>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
