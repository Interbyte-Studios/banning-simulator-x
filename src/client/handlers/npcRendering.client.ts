import { Players, ReplicatedStorage, RunService, TweenService, Workspace } from "@rbxts/services";
import { getNPCByName } from "shared/util/getNpcByName";
import { statsAbbreviator, twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

const mockNpcs = new Instance("Folder");
mockNpcs.Name = "mockNpcs";
mockNpcs.Parent = Workspace;

const npcs = Workspace.WaitForChild("npcs") as Folder;
const runningAnimation = ReplicatedStorage.animations.npcs.runAnimation;
const enemyTag = ReplicatedStorage.assetObjects.tags.enemyTag;
const damageCounter = ReplicatedStorage.assetObjects.tags.damagecounter;

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
const enemyTags = new Instance("ScreenGui");
const healthbarTween = new TweenInfo(0.3, Enum.EasingStyle.Quart, Enum.EasingDirection.In);
enemyTags.ResetOnSpawn = false;
enemyTags.Name = "EnemyTags";
enemyTags.Parent = playerGui;

const connections: Map<Model, { connections: Array<RBXScriptConnection>; objects: Array<Instance> }> = new Map();

/**
 * @param npc The npc model.
 */
function handleMockNPC(npc: Instance): void {
	if (!npc.IsA("Model")) {
		return;
	}

	const parentNPCObject = npc.FindFirstChild("NpcPartObject") as ObjectValue | undefined;
	if (parentNPCObject === undefined) {
		return;
	}

	const parentNPC = parentNPCObject.Value as BasePart;
	if (parentNPC === undefined) {
		return;
	}

	const head = npc.FindFirstChild("Head") as BasePart;
	if (head === undefined) {
		return;
	}

	const humanoid = npc.FindFirstChildOfClass("Humanoid");
	if (humanoid === undefined) {
		return;
	}

	const npcData = getNPCByName(npc.Name);
	if (npcData === undefined) {
		return;
	}

	const animator = humanoid.FindFirstChildOfClass("Animator");
	if (animator === undefined) {
		return;
	}

	const maxHealth = parentNPC.GetAttribute("MaxHealth") as number;
	const health = parentNPC.GetAttribute("Health") as number;
	const isTrialNpc = parentNPC.GetAttribute("TimeTrial") as true | undefined;
	if (maxHealth === undefined || health === undefined) {
		return;
	}

	if (isTrialNpc === true) {
		humanoid.WalkSpeed = 32;
	}

	const tag = enemyTag.Clone();
	tag.hold.name.Text = npc.Name;
	tag.hold.title.Visible = npcData.isBoss;
	tag.hold.title.Text = npcData.isBoss ? `Boss` : `NPC`;
	tag.hold.title.TextColor3 = npcData.isBoss ? Color3.fromRGB(250, 112, 112) : Color3.fromRGB(255, 255, 255);

	tag.hold.fillBackground.fill.Size = UDim2.fromScale(1, 1);
	tag.hold.fillBackground.health.Text = `[${twoDpAbbreviator.numberToString(
		health,
	)} / ${twoDpAbbreviator.numberToString(maxHealth)}]`;

	humanoid.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None;
	humanoid.HealthDisplayType = Enum.HumanoidHealthDisplayType.AlwaysOff;

	tag.Adornee = head;
	tag.Parent = enemyTags;

	const damageCounterClone = damageCounter.Clone();
	damageCounterClone.Parent = head;

	const connectionArray = [];
	const objects: Array<Instance> = [tag, damageCounterClone];

	let runningAnimConnection: RBXScriptConnection;
	const [success, result] = pcall(() => animator.LoadAnimation(runningAnimation));
	if (success) {
		runningAnimConnection = humanoid.Running.Connect((speed) => {
			if (speed > 0) {
				result.Play();
			} else {
				result.Stop();
			}
		});
		connectionArray.push(runningAnimConnection);
		objects.push(result);
	}

	let lastHealth = health;
	const healthConnection = parentNPC.AttributeChanged.Connect((attribute) => {
		if (attribute === "Health") {
			const health = parentNPC.GetAttribute("Health") as number;
			const maxHealth = parentNPC.GetAttribute("MaxHealth") as number;

			const newHealth = health;
			const damage = lastHealth - newHealth;
			lastHealth = newHealth;

			const healthPercentage = health / maxHealth;

			if (healthPercentage > 0.7) {
				tag.hold.fillBackground.fill.BackgroundColor3 = Color3.fromRGB(85, 255, 127);
			} else if (healthPercentage > 0.3) {
				tag.hold.fillBackground.fill.BackgroundColor3 = Color3.fromRGB(255, 237, 84);
			} else {
				tag.hold.fillBackground.fill.BackgroundColor3 = Color3.fromRGB(255, 92, 84);
			}

			const healthTween = TweenService.Create(tag.hold.fillBackground.fill, healthbarTween, {
				Size: UDim2.fromScale(healthPercentage, 1),
			});
			healthTween.Play();
			healthTween.Completed.Wait();

			const hold = tag.FindFirstChild("hold");
			if (hold === undefined) {
				return;
			}

			const fillBackground = hold.FindFirstChild("fillBackground");
			if (fillBackground === undefined) {
				return;
			}

			const healthText = fillBackground.FindFirstChild("health") as TextLabel;
			if (healthText === undefined) {
				return;
			}

			healthText.Text = `[${twoDpAbbreviator.numberToString(health)} / ${twoDpAbbreviator.numberToString(maxHealth)}]`;

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
		}
	});
	const movementConnection = parentNPC.GetPropertyChangedSignal("Position").Connect(() => {
		humanoid.MoveTo(parentNPC.Position);
	});
	connectionArray.push(healthConnection, movementConnection);

	connections.set(npc, {
		connections: connectionArray,
		objects,
	});
}

/**
 * Mocks npcs.
 */
function mockNPCs(): void {
	const character = player.Character;
	if (character === undefined) {
		return;
	}

	const humanoid = character.FindFirstChildOfClass("Humanoid");
	if (humanoid === undefined) {
		return;
	}

	const root = humanoid.RootPart;
	if (root === undefined) {
		return;
	}

	for (const npcPart of npcs.GetChildren()) {
		if (!npcPart.IsA("BasePart")) {
			continue;
		}

		if (npcPart.Transparency !== 1) {
			npcPart.Transparency = 1;
		}

		let correspondingCharacter = npcPart.FindFirstChild("CorrespondingCharacter") as ObjectValue | undefined;
		if (correspondingCharacter === undefined) {
			correspondingCharacter = new Instance("ObjectValue");
			correspondingCharacter.Name = "CorrespondingCharacter";
			correspondingCharacter.Parent = npcPart;
		}

		const health = npcPart.GetAttribute("Health") as number;
		const maxHealth = npcPart.GetAttribute("MaxHealth") as number;
		if (health === undefined || maxHealth === undefined) {
			continue;
		}

		const distance = root.Position.sub(npcPart.Position).Magnitude;
		const withinDistance = distance < 250;

		if (withinDistance) {
			if (correspondingCharacter.Value !== undefined) {
				continue;
			}

			const npc = ReplicatedStorage.assetObjects.npcs.FindFirstChild(npcPart.Name) as Model;
			if (npc === undefined) {
				continue;
			}

			const mockNPC = npc.Clone();

			const humanoid = mockNPC.FindFirstChildOfClass("Humanoid");
			if (humanoid === undefined) {
				mockNPC.Destroy();
				continue;
			}

			mockNPC.PivotTo(npcPart.CFrame.add(new Vector3(0, 10, 0)));

			const npcPartObject = new Instance("ObjectValue");
			npcPartObject.Name = "NpcPartObject";
			npcPartObject.Parent = mockNPC;
			npcPartObject.Value = npcPart;

			humanoid.MaxHealth = maxHealth;
			humanoid.Health = health;

			correspondingCharacter.Value = mockNPC;
			mockNPC.Parent = mockNpcs;
		} else {
			if (correspondingCharacter.Value === undefined) {
				continue;
			}

			if (!correspondingCharacter.Value.IsA("Model")) {
				continue;
			}

			const connectionArray = connections.get(correspondingCharacter.Value);
			if (connectionArray !== undefined) {
				connectionArray.connections.forEach((connection) => connection.Disconnect());
				connectionArray.objects.forEach((object) => object.Destroy());
			} else warn(`Did not find connections for ${correspondingCharacter.Value.Name}`);

			correspondingCharacter.Value.Destroy();
			correspondingCharacter.Value = undefined;
		}

		const removedConnection = npcPart.Destroying.Connect(() => {
			if (correspondingCharacter === undefined) {
				return;
			}

			if (correspondingCharacter.Value === undefined) {
				return;
			}

			if (!correspondingCharacter.Value.IsA("Model")) {
				return;
			}

			const connectionArray = connections.get(correspondingCharacter.Value);
			if (connectionArray !== undefined) {
				connectionArray.connections.forEach((connection) => connection.Disconnect());
				connectionArray.objects.forEach((object) => object.Destroy());
			} else warn(`Did not find connections for ${correspondingCharacter.Value.Name}`);

			correspondingCharacter.Value.Destroy();
			correspondingCharacter.Value = undefined;
			removedConnection.Disconnect();
		});
	}
}

mockNpcs.GetChildren().forEach((npc) => handleMockNPC(npc));
mockNpcs.ChildAdded.Connect((npc) => handleMockNPC(npc));

RunService.Heartbeat.Connect(() => mockNPCs());
