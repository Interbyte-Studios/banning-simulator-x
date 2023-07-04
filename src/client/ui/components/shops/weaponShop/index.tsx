// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";

import { WeaponShopInteractPrompt } from "./interactPrompt";
import { WeaponShop } from "./shop";

interface WeaponShopHandleProps {
	isVisible: boolean;
	setVisibility: (value: boolean) => void;
}

/**
 * Handles the visibility for components related to the weapon shop.
 */
export const WeaponShopHandle = hooks((props: WeaponShopHandleProps) => {
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
		return <WeaponShopInteractPrompt displayShop={(): void => props.setVisibility(true)} />;
	}
});
