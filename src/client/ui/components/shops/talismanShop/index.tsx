// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";

import { TalismanTowerInteractPrompt } from "./interactPrompt";
import { TalismanTower } from "./shop";

interface TalismanTowerHandleProps {
	isVisible: boolean;
	setVisibility: (value: boolean) => void;
}

/**
 * Handles the visibility for components related to the talisman tower.
 */
export const TalismanTowerHandle = hooks((props: TalismanTowerHandleProps) => {
	if (props.isVisible) {
		return (
			<TalismanTower
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
			<TalismanTowerInteractPrompt
				displayShop={(): void => {
					props.setVisibility(true);
				}}
			/>
		);
	}
});
