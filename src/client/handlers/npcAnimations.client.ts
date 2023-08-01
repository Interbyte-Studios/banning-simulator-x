debug.setmemorycategory("npcAnimations");

import { ReplicatedStorage, Workspace } from "@rbxts/services";

const npcs = Workspace.WaitForChild("npcs");
const runningAnimation = ReplicatedStorage.animations.npcs.runAnimation;

/**
 * Handles the running animation for npcs.
 *
 * @param npc The NPC model.
 */
function handleRunningAnimation(npc: Model): void {
	const humanoid = npc.FindFirstChildOfClass("Humanoid");
	if (humanoid === undefined) {
		return;
	}

	const animator = humanoid.FindFirstChildOfClass("Animator");
	if (animator === undefined) {
		return;
	}

	const [success, result] = pcall(() => animator.LoadAnimation(runningAnimation));
	if (success) {
		if (humanoid === undefined) {
			return;
		}

		let runningAnimConnection: RBXScriptConnection | undefined = humanoid.Running.Connect((speed) => {
			if (speed > 0) {
				result.Play();
			} else {
				result.Stop();
			}
		});

		let ancestryChangedConnection: RBXScriptConnection | undefined = humanoid.AncestryChanged.Connect(() => {
			result.Stop();
			result.Destroy();

			if (runningAnimConnection !== undefined) {
				runningAnimConnection.Disconnect();
				runningAnimConnection = undefined;
			}

			if (ancestryChangedConnection !== undefined) {
				ancestryChangedConnection.Disconnect();
				ancestryChangedConnection = undefined;
			}
		});
	}
}

npcs.ChildAdded.Connect((npc) => {
	if (!npc.IsA("Model")) {
		return;
	}

	task.delay(2, (): void => handleRunningAnimation(npc));
});

npcs.GetChildren().forEach((npc) => {
	if (!npc.IsA("Model")) {
		return;
	}

	task.delay(2, (): void => handleRunningAnimation(npc));
});

Workspace.trials.ChildAdded.Connect((child) => {
	task.delay(2, () => {
		const npcs = child.FindFirstChild("npcs");
		if (npcs === undefined) {
			return;
		}

		npcs.GetChildren().forEach((npc) => {
			if (!npc.IsA("Model")) {
				return;
			}

			task.delay(2, (): void => handleRunningAnimation(npc));
		});

		let childAddedConn: RBXScriptConnection | undefined = npcs.ChildAdded.Connect((npc) => {
			if (!npc.IsA("Model")) {
				return;
			}

			task.delay(2, (): void => handleRunningAnimation(npc));
		});

		let ancestryChangedConnection: RBXScriptConnection | undefined = child.AncestryChanged.Connect(() => {
			if (childAddedConn !== undefined) {
				childAddedConn.Disconnect();
				childAddedConn = undefined;
			}

			if (ancestryChangedConnection !== undefined) {
				ancestryChangedConnection.Disconnect();
				ancestryChangedConnection = undefined;
			}
		});
	});
});
