// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { ContextActionService, Players, Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";

import { WeaponShopInteractPrompt } from "./interactPrompt";
import { WeaponShop } from "./shop";

const player = Players.LocalPlayer;

interface WeaponShopHandleProps {
	isVisible: boolean;
	setVisibility: (value: boolean) => void;
}

/**
 * Handles the visibility for components related to the weapon shop.
 */
export const WeaponShopHandle = hooks((props: WeaponShopHandleProps, { useEffect }) => {
	useEffect(() => {
		ContextActionService.BindAction(
			"openWeaponShop",
			(_, state) => {
				if (state !== Enum.UserInputState.Begin) {
					return;
				}

				const character = player.Character;
				if (character === undefined) {
					return warn;
				}

				const humanoid = character.FindFirstChildOfClass("Humanoid");
				if (humanoid === undefined) {
					return;
				}

				const humanoidRootPart = humanoid.RootPart;
				if (humanoidRootPart === undefined) {
					return;
				}

				const magnitude = humanoidRootPart.Position.sub(
					Workspace.interactions.worlds["Ban Land"].weaponShop.InteractPrompt.Position,
				).Magnitude;
				if (magnitude > 25) {
					return;
				}

				props.setVisibility(true);
			},
			false,
			Enum.KeyCode.Q,
		);

		return (): void => {
			ContextActionService.UnbindAction("openWeaponShop");
		};
	});

	if (props.isVisible) {
		return (
			<WeaponShop
				hideMenu={(): void => {
					const camera = Workspace.CurrentCamera;
					assert(camera, `Workspace current camera was undefined. Cannot open shop.`);

					camera.CameraType = Enum.CameraType.Custom;

					props.setVisibility(false);
				}}
			/>
		);
	} else {
		return (
			<WeaponShopInteractPrompt
				displayShop={(): void => {
					props.setVisibility(true);
				}}
			/>
		);
	}
});
