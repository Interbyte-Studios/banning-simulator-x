import { Players, ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
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
friendlyTags.Name = "FriendlyTags";
friendlyTags.Parent = playerGui;

const enemyTags = new Instance("ScreenGui");
enemyTags.Name = "EnemyTags";
enemyTags.Parent = playerGui;

const healthbarTween = new TweenInfo(0.3, Enum.EasingStyle.Linear, Enum.EasingDirection.Out);

/**
 * Creates a player tag that's displayed above the player's head.
 *
 * @param player The player.
 * @param store The player's store.
 */
function createPlayerTag(player: Player, store: Store): void {
	const playerTag = ReplicatedStorage.assetObjects.playerTag;
	assert(playerTag, `Failed to get player tag from rep storage`);

	const character = player.Character;
	if (character === undefined) {
		warn(`Failed to create player tag. The character was not found.`);
		return;
	}

	const head = character.FindFirstChild("Head") as BasePart;
	if (head === undefined) {
		warn("Failed to create player tag. The character head was not found.");
		return;
	}

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

	tag.Adornee = head;
	tag.Parent = friendlyTags;
}

/**
 * Creates an enemy tag that's displayed above the enemy's head.
 *
 * @param enemy The enemy.
 */
function createEnemyTag(enemy: Model): void {
	const enemyTag = ReplicatedStorage.assetObjects.enemyTag;
	assert(enemyTag, `Failed to get enemy tag from rep storage`);

	const humanoid = enemy.WaitForChild("Humanoid") as Humanoid;
	if (humanoid === undefined) {
		warn(`Failed to create enemy tag. Did not find humanoid for "${enemy.Name}"`);
		return;
	}

	const head = enemy.FindFirstChild("Head") as BasePart;
	if (head === undefined) {
		warn(`Failed to create enemy tag. Did not find head for "${enemy.Name}"`);
		return;
	}

	const npcData = getNPCByName(enemy.Name);
	if (npcData === undefined) {
		warn(`Failed to create enemy tag. Did not find data for npc "${enemy.Name}"`);
		return;
	}

	const tag = enemyTag.Clone();
	tag.hold.name.Text = enemy.Name;
	tag.hold.name.rank.Image = getEnemyRankIcon(npcData.rank);
	tag.hold.title.Visible = false;

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

		tag.hold.fillBackground.fill.Size = UDim2.fromScale(1, 1);
		tag.hold.fillBackground.health.Text = `[${humanoid.Health} / ${humanoid.MaxHealth}]`;
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

			player.CharacterAppearanceLoaded.Connect(() => createPlayerTag(player, store));
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
