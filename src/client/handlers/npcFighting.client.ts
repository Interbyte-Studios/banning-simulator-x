import { Players, RunService, UserInputService, Workspace } from "@rbxts/services";
import { getManualAutoFightState, getPurchasedAutoFightState, setManualAutoFight } from "client/modules/autoFightCache";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

const npcs = Workspace.WaitForChild("npcs") as Folder;
let currentConnection: RBXScriptConnection | undefined;
let lastSwingTime = 0;

/**
 * Called when a player interacts with an NPC.
 *
 * @param player The player that interacted with the NPC.
 * @param npc The NPC that was interacted with.
 */
const onNPCInteraction = (player: Player, npc: Model): void => {
	setManualAutoFight(true);

	/**
	 * Called on render stepped.
	 */
	function onRenderStepped(): void {
		debug.profilebegin("onNPCInteraction");
		const npcHumanoid = npc.FindFirstChildOfClass("Humanoid");
		if (npcHumanoid === undefined) {
			return;
		}

		const npcHumanoidRootPart = npcHumanoid.RootPart;
		if (npcHumanoidRootPart === undefined) {
			return;
		}

		const playerCharacter = player.Character;
		if (playerCharacter === undefined) {
			return;
		}

		const playerHumanoid = playerCharacter.FindFirstChildOfClass("Humanoid");
		if (playerHumanoid === undefined) {
			return;
		}

		const playerRootPart = playerHumanoid.RootPart;
		if (playerRootPart === undefined) {
			return;
		}

		const direction = npcHumanoidRootPart.Position.sub(playerRootPart.Position).Unit;
		const targetPosition = npcHumanoidRootPart.Position.sub(direction.mul(3));
		playerHumanoid.MoveTo(targetPosition);
		debug.profileend();
	}

	const npcHumanoid = npc.FindFirstChildOfClass("Humanoid");
	if (npcHumanoid === undefined) {
		if (currentConnection !== undefined) {
			setManualAutoFight(false);
			currentConnection.Disconnect();
			currentConnection = undefined;
		}

		return;
	}

	const diedConnection = npcHumanoid.AncestryChanged.Connect(() => {
		if (currentConnection !== undefined) {
			setManualAutoFight(false);
			currentConnection.Disconnect();
			currentConnection = undefined;
		}

		diedConnection.Disconnect();
	});

	currentConnection = RunService.RenderStepped.Connect(() => onRenderStepped());
};
/**
 * Called when a player presses a key.
 *
 * @param input The input object.
 * @param gameProcessedEvent Whether the event was processed by a higher priority system.
 */
const onInputBegan = (input: InputObject, gameProcessedEvent: boolean): void => {
	if (gameProcessedEvent) {
		return;
	}

	if (getPurchasedAutoFightState()) {
		return;
	}

	if (
		input.UserInputType === Enum.UserInputType.MouseButton1 ||
		input.UserInputType === Enum.UserInputType.Touch ||
		input.UserInputType === Enum.UserInputType.Gamepad1
	) {
		const player = Players.LocalPlayer;
		const mouse = player.GetMouse();

		const camera = Workspace.CurrentCamera;
		if (camera === undefined) {
			return;
		}

		const rayDirection = mouse.Hit.Position.sub(camera.CFrame.Position).Unit.mul(500);
		const raycastParams = new RaycastParams();
		raycastParams.FilterType = Enum.RaycastFilterType.Include;
		raycastParams.FilterDescendantsInstances = [npcs];
		raycastParams.IgnoreWater = true;

		const raycastResult = Workspace.Raycast(camera.CFrame.Position, rayDirection, raycastParams);

		if (raycastResult !== undefined) {
			if (!raycastResult.Instance.IsDescendantOf(npcs)) {
				return;
			}

			const npcParent = raycastResult.Instance.Parent;
			if (npcParent === undefined) {
				return;
			}

			let trueNPC: Model | undefined;
			if (npcParent.IsA("Accessory")) {
				trueNPC = npcParent.Parent as Model;
				if (trueNPC === undefined || !trueNPC.IsA("Model")) {
					return;
				} else;
			} else if (!npcParent.IsA("Model")) {
				return;
			}

			if (currentConnection !== undefined) {
				setManualAutoFight(false);
				currentConnection.Disconnect();
				currentConnection = undefined;
			}

			playSFX(UIEngagement.MajorEngagement);
			task.defer(() => onNPCInteraction(player, trueNPC ?? (npcParent as Model)));
		}
	}
};

/**
 * Returns the current time in seconds.
 */
function handleWeapon(): void {
	const now = time();
	if (now - lastSwingTime < 0.5) {
		return;
	}
	lastSwingTime = now;

	const character = Players.LocalPlayer.Character;
	if (character === undefined) {
		return;
	}

	const weapon = character.FindFirstChildOfClass("Tool");
	if (weapon === undefined) {
		return;
	}

	weapon.Activate();
}

UserInputService.InputBegan.Connect((input, gameProcessedEvent) => {
	onInputBegan(input, gameProcessedEvent);

	if (
		input.UserInputType === Enum.UserInputType.Keyboard &&
		(input.KeyCode === Enum.KeyCode.W ||
			input.KeyCode === Enum.KeyCode.A ||
			input.KeyCode === Enum.KeyCode.S ||
			input.KeyCode === Enum.KeyCode.D)
	) {
		if (currentConnection !== undefined) {
			setManualAutoFight(false);
			currentConnection.Disconnect();
			currentConnection = undefined;
		}
	}
});

UserInputService.TouchMoved.Connect((_, gameProcessedEvent) => {
	if (gameProcessedEvent) {
		return;
	}

	if (currentConnection !== undefined) {
		setManualAutoFight(false);
		currentConnection.Disconnect();
		currentConnection = undefined;
	}
});

task.spawn(() => {
	const player = Players.LocalPlayer;
	const mouse = player.GetMouse();

	RunService.RenderStepped.Connect(() => {
		debug.profilebegin("mouseIcon");
		const target = mouse.Target;
		if (target && target.IsDescendantOf(npcs)) {
			mouse.Icon = assetIds.images.vectors.SmallSword;
		} else {
			mouse.Icon = "rbxasset://textures/ArrowFarCursor.png";
		}
		debug.profileend();
	});
});

RunService.RenderStepped.Connect(() => {
	debug.profilebegin("npcFighting");
	if (currentConnection !== undefined) {
		handleWeapon();

		if (getManualAutoFightState()) {
			setManualAutoFight(true);
		}
	}

	debug.profileend();
});
