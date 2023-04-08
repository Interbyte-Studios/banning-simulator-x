import Roact from "@rbxts/roact";
import { TweenService, Workspace } from "@rbxts/services";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { hooks } from "client/ui/hooks";

import { PurchaseWeapon } from "./purchase";
import { ViewNextWeapon } from "./viewNext";
import { ViewPreviousWeapon } from "./viewPrevious";
import { WeaponShopWeaponInfo } from "./weaponInfo";

interface WeaponShopProps {
	setWeaponShopVisibility: (value: boolean) => void;
}

/**
 * A "camera scrolling" component that allows the player to browse through purchaseable weapons.
 */
export const WeaponShop = hooks((props: WeaponShopProps, { useState, useEffect }) => {
	/* Whether or not the interface has been interacted with or not. Used to determine whether or not to tween camera pos.*/
	const [justOpened, interactedWith] = useState(true);

	const [viewedWeapon, setViewedWeapon] = useState(1);
	const minimumWeaponId = 1;
	const maximumWeaponId = 24;

	useEffect(() => {
		const camera = Workspace.CurrentCamera;
		assert(camera, `Workspace current camera was undefined. Cannot open shop.`);

		const weaponViewpoint = Workspace.interactions.itemShop["Ban Land"].cameraline.FindFirstChild(
			viewedWeapon,
		) as BasePart;
		assert(weaponViewpoint, `Failed to get weapon viewpoint in item shop for weapon with id: "${viewedWeapon}"`);

		camera.CameraType = Enum.CameraType.Scriptable;
		camera.FieldOfView = 70;

		if (justOpened) {
			camera.CFrame = weaponViewpoint.CFrame;
		} else {
			const cameraTweenInfo = new TweenInfo(0.5, Enum.EasingStyle.Linear, Enum.EasingDirection.Out);
			const cameraTween = TweenService.Create(camera, cameraTweenInfo, {
				CFrame: weaponViewpoint.CFrame,
			});
			cameraTween.Play();
		}
	});

	return (
		<>
			<ViewPreviousWeapon
				onActivated={(): void => {
					if (viewedWeapon === minimumWeaponId) {
						return;
					}

					setViewedWeapon(viewedWeapon - 1);
				}}
			/>
			<ViewNextWeapon
				onActivated={(): void => {
					if (viewedWeapon === maximumWeaponId) {
						return;
					}

					if (justOpened) {
						interactedWith(false);
					}

					setViewedWeapon(viewedWeapon + 1);
				}}
			/>
			<WeaponShopWeaponInfo currentWeapon={viewedWeapon} />
			<PurchaseWeapon currentWeapon={viewedWeapon} />
			<ExitButton
				Position={UDim2.fromScale(0.65, 0.9)}
				minimizedSize={0.06}
				maximizedSize={0.07}
				onClosed={(): void => props.setWeaponShopVisibility(false)}
			/>
		</>
	);
});
