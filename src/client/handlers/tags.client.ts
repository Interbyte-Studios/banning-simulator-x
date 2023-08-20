import { GameAnalytics } from "@rbxts/gameanalytics";
import { Players, ReplicatedStorage, RunService } from "@rbxts/services";
import { t } from "@rbxts/t";
import { onStoreCreated } from "client/clientStores";
import { getRankIcon } from "client/util/getRankIcon";
import { GROUP_ROLES } from "shared/configs/game";
import { TITLES } from "shared/configs/titles";
import { Store } from "shared/rodux";

const localPlayer = Players.LocalPlayer;
const playerGui = localPlayer.WaitForChild("PlayerGui") as PlayerGui;
const gradients: Array<UIGradient> = [];

const friendlyTags = new Instance("ScreenGui");
friendlyTags.ResetOnSpawn = false;
friendlyTags.Name = "FriendlyTags";
friendlyTags.Parent = playerGui;

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
		const character = player.Character;
		if (character === undefined) {
			return;
		}

		const humanoid = character.FindFirstChildOfClass("Humanoid");
		if (humanoid === undefined) {
			return;
		}

		const head = character.FindFirstChild("Head") as BasePart;
		if (head === undefined) {
			return;
		}

		const storeState = store.getState();

		const tag = playerTag.Clone();
		tag.hold.name.Text = player.Name;
		tag.hold.name.rank.Image = getRankIcon(storeState.rank);
		tag.hold.title.Visible = storeState.title !== undefined;
		tag.hold.staff.Visible = false;

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

		if (storeState.index.groupRank !== undefined) {
			const groupRank = storeState.index.groupRank;
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
		return;
	}
	assert(isPlayerTag(tag), `Player tag for ${player.Name} was not a valid player tag.`);
	tag.hold.name.rank.Image = getRankIcon(storeState.rank);

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

RunService.RenderStepped.Connect((deltaTime) => {
	debug.setmemorycategory("tags");
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
