// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { TweenService, Workspace } from "@rbxts/services";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { hooks } from "client/ui/hooks";

import { PurchaseTalisman } from "./purchase";
import { TalismanTowerTalismanInfo } from "./talismanInfo";
import { ViewNextTalisman } from "./viewNext";
import { ViewPreviousTalisman } from "./viewPrevious";

interface TalismanTowerProps {
	hideMenu: () => void;
}

/**
 * A "camera scrolling" component that allows the player to browse through purchaseable talismans.
 */
export const TalismanTower = hooks((props: TalismanTowerProps, { useState, useEffect }) => {
	/* Whether or not the interface has been interacted with or not. Used to determine whether or not to tween camera pos.*/
	const [justOpened, interactedWith] = useState(true);

	const [viewedTalisman, setViewedTalisman] = useState(1);
	const minimumTalismanId = 1;
	const maximumTalismanId = 8;

	useEffect(() => {
		const camera = Workspace.CurrentCamera;
		assert(camera, `Workspace current camera was undefined. Cannot open shop.`);

		const talismanViewpoint = Workspace.interactions.talismanTowers["Ban Land"].cameraline.cameraline.FindFirstChild(
			viewedTalisman,
		) as BasePart;
		assert(
			talismanViewpoint,
			`Failed to get talisman viewpoint in item shop for talisman with id: "${viewedTalisman}"`,
		);

		camera.CameraType = Enum.CameraType.Scriptable;
		camera.FieldOfView = 70;

		if (justOpened) {
			camera.CFrame = talismanViewpoint.CFrame;
		} else {
			const cameraTweenInfo = new TweenInfo(0.5, Enum.EasingStyle.Linear, Enum.EasingDirection.Out);
			const cameraTween = TweenService.Create(camera, cameraTweenInfo, {
				CFrame: talismanViewpoint.CFrame,
			});
			cameraTween.Play();
		}
	});

	return (
		<>
			<ViewPreviousTalisman
				onActivated={(): void => {
					if (viewedTalisman === minimumTalismanId) {
						return;
					}

					setViewedTalisman(viewedTalisman - 1);
				}}
			/>
			<ViewNextTalisman
				onActivated={(): void => {
					if (viewedTalisman === maximumTalismanId) {
						return;
					}

					if (justOpened) {
						interactedWith(false);
					}

					setViewedTalisman(viewedTalisman + 1);
				}}
			/>
			<TalismanTowerTalismanInfo currentTalisman={viewedTalisman} />
			<PurchaseTalisman talismanId={viewedTalisman} />
			<ExitButton
				Position={UDim2.fromScale(0.58, 0.925)}
				minimizedSize={0.06}
				maximizedSize={0.07}
				onClosed={(): void => props.hideMenu()}
			/>
		</>
	);
});
