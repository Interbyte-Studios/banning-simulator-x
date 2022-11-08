import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";

import { WeaponShopInteractPrompt } from "./interactPrompt";
import { WeaponShop } from "./shop";

interface WeaponShopHandleProps {
	enabled: boolean;
	weaponShopVisible: boolean;
	setWeaponShopVisibility: (value: boolean) => void;
	displayAnnouncement: (announcementType: "errors" | "announcements", message: string) => void;
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
