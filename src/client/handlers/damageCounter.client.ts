import { Players, ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { getNPCByName } from "shared/util/getNpcByName";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";

const damageCounter = ReplicatedStorage.assetObjects.tags.damagecounter;

/**
 * Creates a damage counter for the npc.
 *
 * @param npc The npc to create the damage counter for.
 */
export function createDamageCounter(npc: Model): void {
	const humanoid = npc.FindFirstChildOfClass("Humanoid");
	if (humanoid === undefined) {
		return;
	}

	const head = npc.FindFirstChild("Head") as BasePart;
	if (head === undefined) {
		return;
	}

	const npcInfo = getNPCByName(npc.Name);

	const damageCounterClone = damageCounter.Clone();
	damageCounterClone.Parent = head;

	let lastHealth = humanoid.Health;
	const healthConnection = humanoid.GetPropertyChangedSignal("Health").Connect(() => {
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

	const ancestryConnection = npc.AncestryChanged.Connect((npcInstance) => {
		const humanoidRootPart = npcInstance.FindFirstChild("HumanoidRootPart") as BasePart;
		if (humanoidRootPart !== undefined) {
			const humanoidRootPartPosition = humanoidRootPart.Position;
			if (npcInfo !== undefined) {
				task.spawn(() => {
					for (let i = 0; i < 3; i++) {
						task.defer(() => {
							const currencyIcon = ReplicatedStorage.assetObjects.emitters.icons.FindFirstChild(
								npcInfo.reward.currencyType.lower(),
							) as BasePart;
							if (currencyIcon !== undefined) {
								const newCurrencyIcon = currencyIcon.Clone();
								newCurrencyIcon.CFrame = new CFrame(humanoidRootPartPosition);
								newCurrencyIcon.Parent = Workspace;

								const blowOutAnim = TweenService.Create(newCurrencyIcon, new TweenInfo(0.3, Enum.EasingStyle.Linear), {
									CFrame: new CFrame(
										humanoidRootPartPosition.add(
											new Vector3(math.random(-5, 5), math.random(3, 10), math.random(-5, 5)),
										),
									),
								});
								blowOutAnim.Play();
								blowOutAnim.Completed.Wait();

								const localCharacter = Players.LocalPlayer.Character;
								if (localCharacter === undefined) {
									newCurrencyIcon.Destroy();
									return;
								}

								const humanoidRootPart = localCharacter.FindFirstChild("HumanoidRootPart") as BasePart;
								if (humanoidRootPart === undefined) {
									newCurrencyIcon.Destroy();
									return;
								}

								const toCharacterAnim = TweenService.Create(
									newCurrencyIcon,
									new TweenInfo(1, Enum.EasingStyle.Linear, Enum.EasingDirection.Out),
									{
										CFrame: new CFrame(humanoidRootPart.Position),
									},
								);
								toCharacterAnim.Play();
								toCharacterAnim.Completed.Wait();

								newCurrencyIcon.Destroy();
							}
						});
					}
				});
			}
		}

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
