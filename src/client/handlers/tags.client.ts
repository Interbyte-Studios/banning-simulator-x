import { GameAnalytics } from "@rbxts/gameanalytics";
import { Players, ReplicatedStorage, RunService, TweenService, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import { onStoreCreated } from "client/clientStores";
import { getRankIcon } from "client/util/getRankIcon";
import { GROUP_ID, GROUP_ROLES } from "shared/configs/game";
import { TITLES } from "shared/configs/titles";
import { Store } from "shared/rodux";
import { getNPCByName } from "shared/util/getNpcByName";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

const localPlayer = Players.LocalPlayer;
const playerGui = localPlayer.WaitForChild("PlayerGui") as PlayerGui;

const npcsFolder = Workspace.WaitForChild("npcs");

const gradients: Array<UIGradient> = [];

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
				badges: t.intersection(
					t.instanceIsA("Frame"),
					t.children({
						UIListLayout: t.instanceIsA("UIListLayout"),
						bans: t.intersection(
							t.instanceIsA("ImageLabel"),
							t.children({
								UIAspectRatioConstraint: t.instanceIsA("UIAspectRatioConstraint"),
								amount: t.intersection(
									t.instanceIsA("TextLabel"),
									t.children({
										UIStroke: t.instanceIsA("UIStroke"),
									}),
								),
							}),
						),
						eggs: t.intersection(
							t.instanceIsA("ImageLabel"),
							t.children({
								UIAspectRatioConstraint: t.instanceIsA("UIAspectRatioConstraint"),
								amount: t.intersection(
									t.instanceIsA("TextLabel"),
									t.children({
										UIStroke: t.instanceIsA("UIStroke"),
									}),
								),
							}),
						),
						prestige: t.intersection(
							t.instanceIsA("ImageLabel"),
							t.children({
								UIAspectRatioConstraint: t.instanceIsA("UIAspectRatioConstraint"),
								amount: t.intersection(
									t.instanceIsA("TextLabel"),
									t.children({
										UIStroke: t.instanceIsA("UIStroke"),
									}),
								),
							}),
						),
					}),
				),
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
 * Creates a player tag that's displayed above the player's head.
 *
 * @param player The player.
 * @param store The player's store.
 */
function createPlayerTag(player: Player, store: Store): void {
	const playerTag = ReplicatedStorage.assetObjects.tags.playerTag;
	assert(playerTag, `Failed to get player tag from rep storage`);

	task.spawn(() => {
		let character = player.Character;
		if (character === undefined) {
			// eslint-disable-next-line no-constant-condition
			while (true) {
				task.wait(1);
				if (player.Character) {
					character = player.Character;
					break;
				}
			}
		}
		if (character === undefined) {
			return;
		}

		let humanoid = character.FindFirstChildOfClass("Humanoid");
		if (humanoid === undefined) {
			// eslint-disable-next-line no-constant-condition
			while (true) {
				task.wait(1);
				if (character.FindFirstChildOfClass("Humanoid")) {
					humanoid = character.FindFirstChildOfClass("Humanoid");
					break;
				}
			}
		}
		if (humanoid === undefined) {
			return;
		}

		let head = character.FindFirstChild("Head") as BasePart;
		if (head === undefined) {
			// eslint-disable-next-line no-constant-condition
			while (true) {
				task.wait(1);
				if (character.FindFirstChild("Head")) {
					head = character.FindFirstChild("Head") as BasePart;
					break;
				}
			}
		}
		if (head === undefined) {
			return;
		}

		const storeState = store.getState();
		const isInGroup = player.IsInGroup(GROUP_ID);

		const tag = playerTag.Clone();
		tag.hold.name.Text = player.Name;
		tag.hold.name.rank.Image = getRankIcon(storeState.rank);
		tag.hold.title.Visible = storeState.title !== undefined;
		tag.hold.staff.Visible = false;

		if (storeState.worldPrestige["Ban Land"].currentPrestige > 0) {
			tag.hold.badges.prestige.amount.Text = `P. ${storeState.worldPrestige["Ban Land"].currentPrestige}`;
			tag.hold.badges.prestige.Visible = true;
		}

		const bansLeaderboard = ReplicatedStorage.leaderboards.bans.FindFirstChild(tostring(player.UserId));
		if (bansLeaderboard !== undefined) {
			const position = bansLeaderboard.GetAttribute("position") as number;
			let title = "Top 100";
			if (position !== undefined) {
				if (position === 1) {
					title = "Top 1";
				} else if (position <= 3) {
					title = "Top 3";
				} else if (position <= 10) {
					title = "Top 10";
				} else if (position <= 25) {
					title = "Top 25";
				} else if (position <= 50) {
					title = "Top 50";
				}
			}
			tag.hold.badges.bans.amount.Text = title;
			tag.hold.badges.bans.Visible = true;
		}

		const eggsLeaderboard = ReplicatedStorage.leaderboards.eggs.FindFirstChild(tostring(player.UserId));
		if (eggsLeaderboard !== undefined) {
			const position = eggsLeaderboard.GetAttribute("position") as number;
			let title = "Top 100";
			if (position !== undefined) {
				if (position === 1) {
					title = "Top 1";
				} else if (position <= 3) {
					title = "Top 3";
				} else if (position <= 10) {
					title = "Top 10";
				} else if (position <= 25) {
					title = "Top 25";
				} else if (position <= 50) {
					title = "Top 50";
				}
			}
			tag.hold.badges.eggs.amount.Text = title;
			tag.hold.badges.eggs.Visible = true;
		}

		if (storeState.title !== undefined) {
			const titleData = TITLES.find((title) => title.name === storeState.title);
			assert(titleData, `Failed to get data for title "${storeState.title}" while creating player tag`);

			tag.hold.title.Text = storeState.title;

			if (typeIs(titleData.effect, "Color3")) {
				tag.hold.title.TextColor3 = titleData.effect;
			} else {
				const titleGradient = new Instance("UIGradient");
				titleGradient.Color = titleData.effect;
				titleGradient.Offset = new Vector2(-0.75, 0);
				titleGradient.Parent = tag.hold.title;
				gradients.push(titleGradient);

				const connection = titleGradient.Destroying.Connect(() => {
					gradients.forEach((gradient, index) => {
						if (gradient === titleGradient) {
							gradients.unorderedRemove(index);
							return;
						}
					});

					connection.Disconnect();
				});

				tag.hold.title.Visible = true;
			}
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

		humanoid.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None;
		humanoid.HealthDisplayType = Enum.HumanoidHealthDisplayType.AlwaysOff;

		tag.Adornee = head;
		tag.Parent = friendlyTags;

		const connection = humanoid.AncestryChanged.Connect(() => {
			tag.Destroy();
			connection.Disconnect();
			return;
		});
	});
}

/**
 * Updates a player's tag.
 *
 * @param player The player.
 * @param store The player's store.
 */
function updatePlayerTag(player: Player, store: Store): void {
	const character = player.Character;
	if (character === undefined) {
		return;
	}

	const head = character.FindFirstChild("Head") as BasePart;
	if (head === undefined) {
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
	if (tag === undefined) {
		createPlayerTag(player, store);
	}
	assert(isPlayerTag(tag), `Player tag for ${player.Name} was not a valid player tag.`);

	tag.hold.name.rank.Image = getRankIcon(storeState.rank);

	if (storeState.worldPrestige["Ban Land"].currentPrestige > 0) {
		tag.hold.badges.prestige.amount.Text = `P. ${storeState.worldPrestige["Ban Land"].currentPrestige}`;
		tag.hold.badges.prestige.Visible = true;
	} else {
		tag.hold.badges.prestige.Visible = false;
	}

	const bansLeaderboard = ReplicatedStorage.leaderboards.bans.FindFirstChild(tostring(player.UserId));
	if (bansLeaderboard !== undefined) {
		const position = bansLeaderboard.GetAttribute("position") as number;
		let title = "Top 100";
		if (position !== undefined) {
			if (position === 1) {
				title = "Top 1";
			} else if (position <= 3) {
				title = "Top 3";
			} else if (position <= 10) {
				title = "Top 10";
			} else if (position <= 25) {
				title = "Top 25";
			} else if (position <= 50) {
				title = "Top 50";
			}
		}
		tag.hold.badges.bans.amount.Text = title;
		tag.hold.badges.bans.Visible = true;
	} else {
		tag.hold.badges.bans.Visible = false;
	}

	const eggsLeaderboard = ReplicatedStorage.leaderboards.eggs.FindFirstChild(tostring(player.UserId));
	if (eggsLeaderboard !== undefined) {
		const position = eggsLeaderboard.GetAttribute("position") as number;
		let title = "Top 100";
		if (position !== undefined) {
			if (position === 1) {
				title = "Top 1";
			} else if (position <= 3) {
				title = "Top 3";
			} else if (position <= 10) {
				title = "Top 10";
			} else if (position <= 25) {
				title = "Top 25";
			} else if (position <= 50) {
				title = "Top 50";
			}
		}
		tag.hold.badges.eggs.amount.Text = title;
		tag.hold.badges.eggs.Visible = true;
	} else {
		tag.hold.badges.eggs.Visible = false;
	}

	if (storeState.title !== undefined && storeState.title !== tag.hold.title.Text) {
		const titleData = TITLES.find((title) => title.name === storeState.title);
		assert(titleData, `Failed to get data for title "${storeState.title}" while creating player tag`);

		tag.hold.title.Text = storeState.title;

		const currentGradient = tag.hold.title.FindFirstChildWhichIsA("UIGradient");
		if (currentGradient !== undefined) {
			currentGradient.Destroy();
		}

		if (typeIs(titleData.effect, "Color3")) {
			tag.hold.title.TextColor3 = titleData.effect;
		} else {
			const titleGradient = new Instance("UIGradient");
			titleGradient.Color = titleData.effect;
			titleGradient.Offset = new Vector2(-0.75, 0);
			titleGradient.Parent = tag.hold.title;
			gradients.push(titleGradient);

			const connection = titleGradient.Destroying.Connect(() => {
				gradients.forEach((gradient, index) => {
					if (gradient === titleGradient) {
						gradients.unorderedRemove(index);
						return;
					}
				});

				connection.Disconnect();
			});

			tag.hold.title.Visible = true;
		}
	}
}

/**
 * Creates an enemy tag that's displayed above the enemy's head.
 *
 * @param enemy The enemy.
 */
function createEnemyTag(enemy: Model): void {
	const enemyTag = ReplicatedStorage.assetObjects.tags.enemyTag;
	assert(enemyTag, `Failed to get enemy tag from rep storage`);

	task.spawn(() => {
		let humanoid = enemy.FindFirstChildOfClass("Humanoid");
		if (humanoid === undefined) {
			// eslint-disable-next-line no-constant-condition
			while (true) {
				task.wait(1);
				if (enemy.FindFirstChildOfClass("Humanoid")) {
					humanoid = enemy.FindFirstChildOfClass("Humanoid");
					break;
				}
			}
		}
		if (humanoid === undefined) {
			return;
		}

		let head = enemy.FindFirstChild("Head") as BasePart;
		if (head === undefined) {
			// eslint-disable-next-line no-constant-condition
			while (true) {
				task.wait(1);
				if (enemy.FindFirstChild("Head")) {
					head = enemy.FindFirstChild("Head") as BasePart;
					break;
				}
			}
		}
		if (head === undefined) {
			return;
		}

		const npcData = getNPCByName(enemy.Name);
		if (npcData === undefined) {
			return;
		}

		const tag = enemyTag.Clone();
		tag.hold.name.Text = enemy.Name;
		tag.hold.name.rank.Image = getRankIcon(npcData.rank);
		tag.hold.title.Visible = npcData.isBoss;
		tag.hold.title.Text = npcData.isBoss ? `Boss` : `NPC`;
		tag.hold.title.TextColor3 = npcData.isBoss ? Color3.fromRGB(250, 112, 112) : Color3.fromRGB(255, 255, 255);

		tag.hold.fillBackground.fill.Size = UDim2.fromScale(1, 1);
		tag.hold.fillBackground.health.Text = `[${twoDpAbbreviator.numberToString(
			humanoid.Health,
		)} / ${twoDpAbbreviator.numberToString(humanoid.MaxHealth)}]`;

		humanoid.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None;
		humanoid.HealthDisplayType = Enum.HumanoidHealthDisplayType.AlwaysOff;

		tag.Adornee = head;
		tag.Parent = enemyTags;

		const healthConnection = humanoid.GetPropertyChangedSignal("Health").Connect(() => {
			if (humanoid === undefined) {
				return;
			}

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

			healthText.Text = `[${twoDpAbbreviator.numberToString(humanoid.Health)} / ${twoDpAbbreviator.numberToString(
				humanoid.MaxHealth,
			)}]`;
		});

		const ancestryChangedConnection = humanoid.AncestryChanged.Connect(() => {
			healthConnection.Disconnect();
			tag.Parent = undefined;
			tag.Destroy();
			if (humanoid !== undefined) {
				humanoid.Parent = undefined;
				humanoid.Destroy();
			}
			ancestryChangedConnection.Disconnect();
			return;
		});
	});
}

/**
 * @param player The player.
 */
function onPlayerAdded(player: Player): void {
	onStoreCreated(player)
		.andThen((store) => {
			task.wait(5);

			if (player.Character) {
				createPlayerTag(player, store);
			}

			player.CharacterAdded.Connect(() => createPlayerTag(player, store));

			store.changed.connect((newState, oldState) => {
				if (newState.rank !== oldState.rank) {
					updatePlayerTag(player, store);
				}

				if (newState.title !== oldState.title) {
					updatePlayerTag(player, store);
				}

				if (newState.worldPrestige["Ban Land"].currentPrestige !== oldState.worldPrestige["Ban Land"].currentPrestige) {
					updatePlayerTag(player, store);
				}
			});

			ReplicatedStorage.leaderboards.timeUpdated.GetPropertyChangedSignal("Value").Connect(() => {
				task.delay(3, (): void => updatePlayerTag(player, store));
			});
		})
		.catch((e) => {
			// do not include player names. against the rules apparently.
			GameAnalytics.addErrorEvent(Players.LocalPlayer.UserId, {
				severity: "error",
				message: `[ Billboard Tags Handler ] - Failed to run promise callback on "onStoreCreated" | ${e}`,
			});
			throw `[ Billboard Tags Handler ] - Failed to run promise callback on "onStoreCreated" for ${player.Name} | ${e}`;
		});
}

Players.PlayerAdded.Connect(onPlayerAdded);
Players.GetPlayers().forEach(onPlayerAdded);

npcsFolder.ChildAdded.Connect((enemy) => {
	if (!enemy.IsA("Model")) {
		return;
	}

	task.delay(2, () => createEnemyTag(enemy));
});

npcsFolder.GetChildren().forEach((enemy) => {
	if (!enemy.IsA("Model")) {
		return;
	}

	task.delay(2, () => createEnemyTag(enemy));
});

Workspace.trials.ChildAdded.Connect((timeTrialMap) => {
	task.delay(2, () => {
		const npcs = timeTrialMap.FindFirstChild("npcs");
		if (npcs === undefined) {
			return;
		}

		npcs.GetChildren().forEach((enemy) => {
			if (!enemy.IsA("Model")) {
				return;
			}

			task.delay(2, () => createEnemyTag(enemy));
		});

		const npcAddedConnection = npcs.ChildAdded.Connect((enemy) => {
			if (!enemy.IsA("Model")) {
				return;
			}

			task.delay(2, () => createEnemyTag(enemy));
		});

		const ancestryChangedConnection = timeTrialMap.AncestryChanged.Connect(() => {
			npcAddedConnection.Disconnect();
			ancestryChangedConnection.Disconnect();
			return;
		});
	});
});

RunService.RenderStepped.Connect((deltaTime) => {
	debug.profilebegin("Gradient Tags");
	gradients.forEach((gradient) => {
		if (gradient.Offset.X < 0.75) {
			gradient.Offset = new Vector2(gradient.Offset.X + 0.5 * deltaTime, 0);
		} else {
			gradient.Offset = new Vector2(-0.75, 0);
		}

		gradient.Rotation = 40;
	});
	debug.profileend();
});
