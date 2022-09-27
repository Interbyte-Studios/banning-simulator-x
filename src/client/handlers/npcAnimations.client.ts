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
	assert(humanoid, `Failed to load running animation for ${npc.Name}. Could not find humanoid.`);

	const animator = humanoid.FindFirstChildOfClass("Animator");
	assert(animator, `Failed to load running animation for ${npc.Name}. Could not find animator object.`);

	const runAnim = animator.LoadAnimation(runningAnimation);

	humanoid.Running.Connect((speed) => {
		if (speed > 0) {
			runAnim.Play();
		} else {
			runAnim.Stop();
		}
	});
}

npcs.ChildAdded.Connect((npc) => {
	if (!npc.IsA("Model")) {
		return;
	}

	handleRunningAnimation(npc);
});

npcs.GetChildren().forEach((npc) => {
	if (!npc.IsA("Model")) {
		return;
	}

	handleRunningAnimation(npc);
});
