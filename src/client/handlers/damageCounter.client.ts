import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";

const damageCounter = ReplicatedStorage.assetObjects.tags.damagecounter;

/**
 * Creates a damage counter for the npc.
 *
 * @param npc The npc to create the damage counter for.
 */
export function createDamageCounter(npc: Model): void {
	let humanoid = npc.FindFirstChildOfClass("Humanoid");
	if (humanoid === undefined) {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			task.wait(1);
			if (npc.FindFirstChildOfClass("Humanoid")) {
				humanoid = npc.FindFirstChildOfClass("Humanoid");
				break;
			}
		}
	}
	if (humanoid === undefined) {
		return;
	}

	let head = npc.FindFirstChild("Head") as BasePart;
	if (head === undefined) {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			task.wait(1);
			if (npc.FindFirstChild("Head")) {
				head = npc.FindFirstChild("Head") as BasePart;
				break;
			}
		}
	}
	if (head === undefined) {
		return;
	}

	const damageCounterClone = damageCounter.Clone();
	damageCounterClone.Parent = head;

	let lastHealth = humanoid.Health;
	const healthConnection = humanoid.GetPropertyChangedSignal("Health").Connect(() => {
		if (humanoid === undefined) {
			return;
		}

		const newHealth = humanoid.Health;
		const damage = lastHealth - newHealth;
		lastHealth = newHealth;

		const newDamageCounter = damageCounterClone.template.Clone();
		newDamageCounter.Text = statsAbbreviator.numberToString(damage);

		const randomNumber = math.ceil(math.random(1, 3));
		const randomPosition =
			randomNumber === 1
				? UDim2.fromScale(0.5, 0.5)
				: randomNumber === 2
				? UDim2.fromScale(0.3, 0.4)
				: UDim2.fromScale(0.7, 0.4);
		newDamageCounter.Position = randomPosition;
		newDamageCounter.Parent = damageCounterClone;
		newDamageCounter.Visible = true;

		task.spawn(() => {
			const anim = TweenService.Create(newDamageCounter, new TweenInfo(0.85), {
				Position: UDim2.fromScale(randomPosition.X.Scale, randomPosition.Y.Scale - 0.2),
			});
			anim.Play();
			anim.Completed.Wait();
			newDamageCounter.Destroy();
		});
	});

	const ancestryConnection = npc.AncestryChanged.Connect(() => {
		healthConnection.Disconnect();

		if (damageCounterClone !== undefined) {
			damageCounterClone.Destroy();
		}

		ancestryConnection.Disconnect();
	});
}

const npcFolder = Workspace.WaitForChild("npcs") as Folder;
for (const npc of npcFolder.GetChildren()) {
	if (!npc.IsA("Model")) {
		continue;
	}

	task.delay(2, (): void => createDamageCounter(npc));
}

npcFolder.ChildAdded.Connect((child) => {
	if (!child.IsA("Model")) {
		return;
	}

	task.delay(2, (): void => createDamageCounter(child));
});

Workspace.trials.ChildAdded.Connect((child) => {
	task.delay(2, () => {
		const npcs = child.FindFirstChild("npcs") as Folder;
		if (npcs !== undefined) {
			for (const npc of npcs.GetChildren()) {
				if (!npc.IsA("Model")) {
					continue;
				}

				task.delay(2, (): void => createDamageCounter(npc));
			}
		}
	});
});
