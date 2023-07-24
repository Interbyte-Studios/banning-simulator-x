import { ReplicatedStorage, Workspace } from "@rbxts/services";

const npcs = Workspace.WaitForChild("npcs");
const runningAnimation = ReplicatedStorage.animations.npcs.runAnimation;

/**
 * Handles the running animation for npcs.
 *
 * @param npc The NPC model.
 */
function handleRunningAnimation(npc: Model): void {
	const humanoid = npc.WaitForChild("Humanoid") as Humanoid;
	if (humanoid === undefined) {
		return;
	}

	const animator = humanoid.FindFirstChildOfClass("Animator");
	if (animator === undefined) {
		return;
	}

	pcall(() => {
		const runAnim = animator.LoadAnimation(runningAnimation);

		const runningAnimConnection = humanoid.Running.Connect((speed) => {
			if (speed > 0) {
				runAnim.Play();
			} else {
				runAnim.Stop();
			}
		});

		const ancestryChangedConnection = humanoid.AncestryChanged.Connect(() => {
			runAnim.Stop();
			runAnim.Destroy();
			runningAnimConnection.Disconnect();
			ancestryChangedConnection.Disconnect();
		});
	});
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

		const childAddedConn = npcs.ChildAdded.Connect((npc) => {
			if (!npc.IsA("Model")) {
				return;
			}

			task.delay(2, (): void => handleRunningAnimation(npc));
		});

		const ancestryChangedConnection = child.AncestryChanged.Connect(() => {
			childAddedConn.Disconnect();
			ancestryChangedConnection.Disconnect();
		});
	});
});
