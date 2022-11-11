import { Players, ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import { onStoreCreated } from "client/clientStores";
import { getEnemyRankIcon } from "client/util/getEnemyRankIcon";
import { getRankIcon } from "client/util/getRankIcon";
import { GROUP_ID, GROUP_ROLES } from "shared/configs/game";
import { Store } from "shared/rodux";
import { getNPCByName } from "shared/util/getNpcByName";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

const npcsFolder = Workspace.WaitForChild("npcs");

const friendlyTags = new Instance("ScreenGui");
friendlyTags.ResetOnSpawn = false;
friendlyTags.Name = "FriendlyTags";
friendlyTags.Parent = playerGui;

const enemyTags = new Instance("ScreenGui");
enemyTags.ResetOnSpawn = false;
enemyTags.Name = "EnemyTags";
enemyTags.Parent = playerGui;

const healthbarTween = new TweenInfo(0.3, Enum.EasingStyle.Quart, Enum.EasingDirection.In);

const isPlayerTag = t.intersection(
	t.instanceIsA("BillboardGui"),
	t.children({
		hold: t.intersection(
			t.instanceIsA("Frame"),
			t.children({
				UIListLayout: t.instanceIsA("UIListLayout"),
				name: t.intersection(
					t.instanceIsA("TextLabel"),
					t.children({
						UIStroke: t.instanceIsA("UIStroke"),
						rank: t.intersection(
							t.instanceIsA("ImageLabel"),
							t.children({
								UIAspectRatioConstraint: t.instanceIsA("UIAspectRatioConstraint"),
							}),
						),
					}),
				),
				staff: t.intersection(
					t.instanceIsA("TextLabel"),
					t.children({
						UIStroke: t.instanceIsA("UIStroke"),
					}),
				),
				title: t.intersection(
					t.instanceIsA("TextLabel"),
					t.children({
						UIStroke: t.instanceIsA("UIStroke"),
					}),
				),
			}),
		),
	}),
);

/**
 * Updates a player's tag.
 *
 * @param player The player.
 * @param store The player's store.
 */
function updatePlayerTag(player: Player, store: Store): void {
	const character = player.Character;
	if (character === undefined) {
		warn(`Failed to update player tag for "${player.Name}". The Character was not found.`);
		return;
	}

	const head = character.FindFirstChild("Head") as BasePart;
	if (head === undefined) {
		warn(`Failed to update player tag for "${player.Name}". The Head was not found.`);
		return;
	}

	const storeState = store.getState();

	let tag: BillboardGui | undefined;
	for (const playerTag of friendlyTags.GetChildren()) {
		if (!playerTag.IsA("BillboardGui")) {
			continue;
		}

		if (playerTag.Adornee !== head) {
			continue;
		}

		tag = playerTag;
		break;
	}
	assert(tag, `Failed to find player tag for ${player.Name}`);
	assert(isPlayerTag(tag), `Player tag for ${player.Name} was not a valid player tag.`);

	tag.hold.name.rank.Image = getRankIcon(storeState.rank);
}

/**
 * Creates a player tag that's displayed above the player's head.
 *
 * @param player The player.
 * @param store The player's store.
 */
function createPlayerTag(player: Player, store: Store): void {
	const playerTag = ReplicatedStorage.assetObjects.tags.playerTag;
	assert(playerTag, `Failed to get player tag from rep storage`);

	const character = player.Character;
	assert(character, `Failed to create player tag. The Character for ${player.Name} was not found.`);

	const humanoid = character.WaitForChild("Humanoid") as Humanoid;
	assert(humanoid, `Failed to create player tag. The Humanoid for ${player.Name} was not found.`);

	const head = character.FindFirstChild("Head") as BasePart;
	assert(head, `Failed to create player tag. The Head for ${player.Name} was not found.`);

	const storeState = store.getState();
	const isInGroup = player.IsInGroup(GROUP_ID);

	const tag = playerTag.Clone();
	tag.hold.name.Text = player.Name;
	tag.hold.name.rank.Image = getRankIcon(storeState.rank);
	tag.hold.title.Visible = storeState.title !== undefined;
	tag.hold.staff.Visible = false;

	if (storeState.title !== undefined) {
		// todo: Add gradient or color
		//const titleData = TITLES.find((title) => title.name === storeState.title);
		//assert(titleData, `Failed to get data for title "${storeState.title}" while creating player tag`);

		tag.hold.title.Text = storeState.title;
	}

	if (isInGroup) {
		const groupRank = player.GetRankInGroup(GROUP_ID);
		const groupRankData = GROUP_ROLES[groupRank];
		if (groupRankData === undefined) {
			return;
		}

		tag.hold.staff.Text = groupRankData.tag;
		tag.hold.staff.TextColor3 = groupRankData.color;
		tag.hold.staff.Visible = true;
	}

	humanoid.Died.Connect(() => {
		tag.Destroy();
		return;
	});

	humanoid.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None;
	humanoid.HealthDisplayType = Enum.HumanoidHealthDisplayType.AlwaysOff;

	tag.Adornee = head;
	tag.Parent = friendlyTags;
}

/**
 * Creates an enemy tag that's displayed above the enemy's head.
 *
 * @param enemy The enemy.
 */
function createEnemyTag(enemy: Model): void {
	const enemyTag = ReplicatedStorage.assetObjects.tags.enemyTag;
	assert(enemyTag, `Failed to get enemy tag from rep storage`);

	const humanoid = enemy.WaitForChild("Humanoid") as Humanoid;
	assert(humanoid, `Failed to create enemy tag. Infinitely yielded for Humanoid for enemey: ${enemy.Name}`);

	const head = enemy.WaitForChild("Head") as BasePart;
	assert(head, `Failed to create enemy tag. Infinitely yielded for Head for enemey: ${enemy.Name}`);

	const npcData = getNPCByName(enemy.Name);
	if (npcData === undefined) {
		warn(`Failed to create enemy tag. Did not find data for npc "${enemy.Name}"`);
		return;
	}

	const tag = enemyTag.Clone();
	tag.hold.name.Text = enemy.Name;
	tag.hold.name.rank.Image = getEnemyRankIcon(npcData.rank, npcData.isBoss);
	tag.hold.title.Visible = npcData.isBoss;
	tag.hold.title.Text = npcData.isBoss ? `Boss` : `NPC`;
	tag.hold.title.TextColor3 = npcData.isBoss ? Color3.fromRGB(250, 112, 112) : Color3.fromRGB(255, 255, 255);

	tag.hold.fillBackground.fill.Size = UDim2.fromScale(1, 1);
	tag.hold.fillBackground.health.Text = `[${humanoid.Health} / ${humanoid.MaxHealth}]`;

	humanoid.GetPropertyChangedSignal("Health").Connect(() => {
		const health = humanoid.Health;
		const maxHealth = humanoid.MaxHealth;

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

		tag.hold.fillBackground.health.Text = `[${humanoid.Health} / ${humanoid.MaxHealth}]`;
	});

	humanoid.Died.Connect(() => {
		tag.Destroy();
		return;
	});

	humanoid.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None;
	humanoid.HealthDisplayType = Enum.HumanoidHealthDisplayType.AlwaysOff;

	tag.Adornee = head;
	tag.Parent = enemyTags;
}

/**
 * @param player The player.
 */
function onPlayerAdded(player: Player): void {
	onStoreCreated(player)
		.andThen((store) => {
			if (player.Character) {
				createPlayerTag(player, store);
			}

			player.CharacterAdded.Connect(() => createPlayerTag(player, store));

			store.changed.connect((newState, oldState) => {
				if (newState.rank === oldState.rank) {
					return;
				}

				updatePlayerTag(player, store);
			});
		})
		.catch((e) => {
			throw `Failed to get store for player ${player.Name} | ${e}`;
		});
}

Players.PlayerAdded.Connect(onPlayerAdded);
Players.GetPlayers().forEach(onPlayerAdded);

npcsFolder.ChildAdded.Connect((enemy) => {
	if (!enemy.IsA("Model")) {
		return;
	}

	createEnemyTag(enemy);
});

npcsFolder.GetChildren().forEach((enemy) => {
	if (!enemy.IsA("Model")) {
		return;
	}

	createEnemyTag(enemy);
});
