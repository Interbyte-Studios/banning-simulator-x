// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { ContextActionService, Players, Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";

import { TalismanTowerInteractPrompt } from "./interactPrompt";
import { TalismanTower } from "./shop";

const player = Players.LocalPlayer;

interface TalismanTowerHandleProps {
	enabled: boolean;
	setVisibility: (value: boolean) => void;
}

/**
 * Handles the visibility for components related to the talisman tower.
 */
export const TalismanTowerHandle = hooks((props: TalismanTowerHandleProps, { useEffect, useState }) => {
	const [interfaceVisible, setInterfaceVisibility] = useState(false);

	useEffect(() => {
		if (!props.enabled) {
			const camera = Workspace.CurrentCamera;
			assert(camera, `Workspace current camera was undefined. Cannot open shop.`);

			camera.CameraType = Enum.CameraType.Custom;
		}
	}, [props.enabled]);

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

				props.setVisibility(true);
			},
			false,
			Enum.KeyCode.X,
		);

		return (): void => {
			ContextActionService.UnbindAction("openTalismanTower");
		};
	});

	if (!props.enabled) {
		return <></>;
	} else if (interfaceVisible) {
		return (
			<TalismanTower
				hideMenu={(): void => {
					setInterfaceVisibility(false);
					props.setVisibility(false);
				}}
			/>
		);
	} else {
		return (
			<TalismanTowerInteractPrompt
				displayShop={(): void => {
					setInterfaceVisibility(true);
					props.setVisibility(true);
				}}
			/>
		);
	}
});
