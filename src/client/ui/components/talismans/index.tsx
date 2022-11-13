import Roact from "@rbxts/roact";
import { ContextActionService, Players, Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";

import { TalismanTowerInteractPrompt } from "./interactPrompt";
import { TalismanTower } from "./shop";

const player = Players.LocalPlayer;

interface TalismanTowerHandleProps {
	enabled: boolean;
	talismanTowerVisible: boolean;
	setTalismanTowerVisibility: (value: boolean) => void;
	displayAnnouncement: (message: string, displayTime?: number) => void;
}

/**
 * Handles the visibility for components related to the talisman tower.
 */
export const TalismanTowerHandle = hooks((props: TalismanTowerHandleProps, { useEffect }) => {
	if (!props.enabled) {
		return <></>;
	}

	useEffect(() => {
		if (!props.talismanTowerVisible) {
			const camera = Workspace.CurrentCamera;
			assert(camera, `Workspace current camera was undefined. Cannot open shop.`);

			camera.CameraType = Enum.CameraType.Custom;
		}
	});

	useEffect(() => {
		ContextActionService.BindAction(
			"openTalismanTower",
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
					Workspace.interactions.worlds["Ban Land"].talismanTower.InteractPrompt.Position,
				).Magnitude;
				if (magnitude > 25) {
					return;
				}

				props.setTalismanTowerVisibility(true);
			},
			false,
			Enum.KeyCode.X,
		);

		return (): void => {
			ContextActionService.UnbindAction("openTalismanTower");
		};
	});

	if (props.talismanTowerVisible) {
		return (
			<TalismanTower
				setTalismanTowerVisibility={props.setTalismanTowerVisibility}
				displayAnnouncement={props.displayAnnouncement}
			/>
		);
	} else {
		return (
			<TalismanTowerInteractPrompt visible={true} displayShop={(): void => props.setTalismanTowerVisibility(true)} />
		);
	}
});
