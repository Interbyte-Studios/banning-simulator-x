import Roact from "@rbxts/roact";
import { ContextActionService, Players, Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";

import { WeaponShopInteractPrompt } from "./interactPrompt";
import { WeaponShop } from "./shop";

const player = Players.LocalPlayer;

interface WeaponShopHandleProps {
	enabled: boolean;
	weaponShopVisible: boolean;
	setWeaponShopVisibility: (value: boolean) => void;
	displayAnnouncement: (message: string, displayTime?: number) => void;
}

/**
 * Handles the visibility for components related to the weapon shop.
 */
export const WeaponShopHandle = hooks((props: WeaponShopHandleProps, { useEffect }) => {
	if (!props.enabled) {
		return <></>;
	}

	useEffect(() => {
		if (!props.weaponShopVisible) {
			const camera = Workspace.CurrentCamera;
			assert(camera, `Workspace current camera was undefined. Cannot open shop.`);

			camera.CameraType = Enum.CameraType.Custom;
		}
	});

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

				props.setWeaponShopVisibility(true);
			},
			false,
			Enum.KeyCode.Q,
		);

		return (): void => {
			ContextActionService.UnbindAction("openWeaponShop");
		};
	});

	if (props.weaponShopVisible) {
		return (
			<WeaponShop
				setWeaponShopVisibility={props.setWeaponShopVisibility}
				displayAnnouncement={props.displayAnnouncement}
			/>
		);
	} else {
		return <WeaponShopInteractPrompt visible={true} displayShop={(): void => props.setWeaponShopVisibility(true)} />;
	}
});
