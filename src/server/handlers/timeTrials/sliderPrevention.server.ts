import { RunService, Workspace } from "@rbxts/services";
import { currentTimeTrials } from "server/modules/timeTrials";
import { isNpcCharacter } from "shared/remotes/damageNPC";

const npcsToCheck: Array<{ npc: Model; ground: BasePart }> = [];
Workspace.trials.ChildAdded.Connect((child) => {
	if (!child.IsA("Model")) return;

	const npcsFolder = child.FindFirstChild("npcs");
	if (npcsFolder === undefined) return;

	const ground = child.FindFirstChild("ground") as BasePart;
	if (ground === undefined) return;

	npcsFolder.GetChildren().forEach((npc) => {
		if (!npc.IsA("Model")) {
			return;
		}

		npcsToCheck.push({ npc, ground });
	});

	npcsFolder.ChildRemoved.Connect((child) => {
		if (!child.IsA("Model")) return;

		const index = npcsToCheck.findIndex((npc) => npc.npc === child);
		if (index === -1) return;

		npcsToCheck.remove(index);
	});
});

RunService.Heartbeat.Connect(() => {
	npcsToCheck.forEach((npc) => {
		for (const [player, trialData] of currentTimeTrials) {
			if (trialData.npcs.find((_npc) => _npc.instance === npc.npc) === undefined) {
				return;
			}

			if (!isNpcCharacter(npc.npc)) {
				return;
			}

			const leftFoot = npc.npc.FindFirstChild("LeftFoot") as BasePart;
			if (leftFoot === undefined) {
				return;
			}

			if (leftFoot.Position.Y < npc.ground.Position.Y - 1.5 - npc.ground.Size.Y / 2) {
				npc.npc.Humanoid.TakeDamage(npc.npc.Humanoid.MaxHealth);
				currentTimeTrials.set(player, {
					...trialData,
					npcs: trialData.npcs.filter((_npc) => _npc.instance !== npc.npc),
				});
				npc.npc.Destroy();
			}
		}
	});
});
