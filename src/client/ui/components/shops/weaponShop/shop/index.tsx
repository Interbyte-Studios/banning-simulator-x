// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { TweenService, Workspace } from "@rbxts/services";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { hooks } from "client/ui/hooks";
import { MAX_WEAPON_ID } from "shared/configs/weapons";
import { StoreState } from "shared/rodux";
import { CurrentWeaponState } from "shared/rodux/currentWeapon";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

import { PurchaseWeapon } from "./purchase";
import { ViewNextWeapon } from "./viewNext";
import { ViewPreviousWeapon } from "./viewPrevious";
import { WeaponShopWeaponInfo } from "./weaponInfo";

interface WeaponShopProps extends WeaponShopMappedProps {
	hideMenu: () => void;
}

interface WeaponShopMappedProps {
	currentWeapon: CurrentWeaponState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): WeaponShopMappedProps {
	return {
		currentWeapon: state.currentWeapon,
	};
}

const highlight = new Instance("Highlight");
highlight.Parent = undefined;
highlight.FillTransparency = 1;
highlight.OutlineColor = Color3.fromRGB(0, 0, 0);

/**
 * A "camera scrolling" component that allows the player to browse through purchaseable weapons.
 */
export const WeaponShop = RoactRodux.connect(mapStateToProps)(
	hooks((props: WeaponShopProps, { useState, useEffect }) => {
		/* Whether or not the interface has been interacted with or not. Used to determine whether or not to tween camera pos.*/
		const [justOpened, setJustOpened] = useState(true);

		const [viewedWeapon, setViewedWeapon] = useState(props.currentWeapon.id);
		const minimumWeaponId = 1;
		const maximumWeaponId = MAX_WEAPON_ID;

		const weaponInfo = getWeaponInfo(viewedWeapon);

		useEffect(() => {
			const camera = Workspace.CurrentCamera;
			assert(camera, `Workspace current camera was undefined. Cannot open shop.`);

			const weaponViewpoint = Workspace.interactions.itemShop["Ban Land"].cameraline.cameraline.FindFirstChild(
				viewedWeapon,
			) as BasePart;
			assert(weaponViewpoint, `Failed to get weapon viewpoint in item shop for weapon with id: "${viewedWeapon}"`);

			const weaponModel = Workspace.interactions.itemShop["Ban Land"].weapons.FindFirstChild(weaponInfo.name);
			assert(weaponModel, `Failed to get weapon model for ${weaponInfo.name}`);
			highlight.Parent = weaponModel;

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

						if (justOpened) {
							setJustOpened(false);
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
							setJustOpened(false);
						}

						setViewedWeapon(viewedWeapon + 1);
					}}
				/>
				<WeaponShopWeaponInfo currentWeapon={viewedWeapon} />
				<PurchaseWeapon weaponId={viewedWeapon} />
				<ExitButton
					Position={UDim2.fromScale(0.58, 0.925)}
					minimizedSize={0.06}
					maximizedSize={0.07}
					onClosed={(): void => props.hideMenu()}
				/>
			</>
		);
	}),
);
