import { DataStoreService, Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { retrieveStore } from "server/playerStore";

/// SETTINGS ///
const UPDATE_TIME = 20;
const UPDATE_LEADERBOARDS = true;
const MAX_TRIES = 5;
const STORE_NAME = "GLOBAL_LB";

/// STORES ///
const bansStore = DataStoreService.GetOrderedDataStore(STORE_NAME, "bans");
const eggStore = DataStoreService.GetOrderedDataStore(STORE_NAME, "eggs");

type leaderboardCurrencies = "bans" | "eggs";

type collectedData = Map<string, { rank: number; id: string; amount: number }>;

type leaderboardFrameInterface = Frame & {
	PlayerIcon: Frame & { Pos: Frame & { Label: TextLabel }; Icon: ImageLabel };
	NameLabel: TextLabel;
	AmountLabel: TextLabel;
};

type leaderboardUI = SurfaceGui & {
	Main: Frame & {
		Leaderboard: Frame & {
			List: ScrollingFrame;
		};
		Label: TextLabel;
	};
};

const leaderboards = Workspace.interactions.leaderboards;

const cachedLeaderboards = new Map<leaderboardCurrencies, Map<string, { id: string; rank: number; amount: number }>>();
cachedLeaderboards.set("bans", new Map());
cachedLeaderboards.set("eggs", new Map());

/**
 * Updates The leaderboard that matches the currency name with players currency amount.
 *
 * @param playerId String The id of the player that we are updating for.
 * @param currencyName String The name of the currency that is being updated.
 * @param currencyAmount Number The amount that the currency is being updated to.
 */
function updateLeaderboardPlayerAmount(
	playerId: string,
	currencyName: leaderboardCurrencies,
	currencyAmount: number,
): void {
	let tries = 0;
	let isSuccesful = false;

	const selectedStore: OrderedDataStore | undefined =
		currencyName === "bans" ? bansStore : currencyName === "eggs" ? eggStore : undefined;
	assert(selectedStore, `Could not get store for currency ${currencyName}`);

	task.spawn(() => {
		while (tries < MAX_TRIES || isSuccesful) {
			const [success] = pcall(() =>
				selectedStore.UpdateAsync(playerId, (): number => {
					return currencyAmount;
				}),
			);

			if (!success) {
				tries += 1;
				print(tries);
			} else {
				isSuccesful = true;
				break;
			}

			task.wait(1);
		}
	});
}

/**
 *
 * @param currencyName String The name of the currency that is being retrieved.
 * @returns Players data for the selected leaderboard.
 */
function getStores(currencyName: leaderboardCurrencies): collectedData {
	let selectedStore: OrderedDataStore | undefined;

	if (currencyName === "bans") {
		selectedStore = bansStore;
	} else if (currencyName === "eggs") {
		selectedStore = eggStore;
	} else {
		error(`Could not get store for currency ${currencyName}`);
	}

	const sortedStore = selectedStore.GetSortedAsync(true, 100, 1);
	const collectedData = new Map<string, { rank: number; id: string; amount: number }>();
	const currentPage = sortedStore.GetCurrentPage();

	currentPage.forEach((value, rank) => {
		const amount = value.value as number;
		collectedData.set(value.key, { rank: rank, id: value.key, amount: amount });
	});

	return collectedData;
}

/**
 *  Updates stored cache for the leaderboard.
 *
 * @param currencyName String the name of the currency for which cache is being updated.
 * @param leaderboardData Table.
 */
function updateCachedStore(currencyName: leaderboardCurrencies, leaderboardData: collectedData): void {
	const cacheMap = cachedLeaderboards.get(currencyName);
	if (cacheMap === undefined) {
		warn(`Could not find cache map for ${currencyName}`);
		return;
	}

	leaderboardData.forEach((playerData) => {
		cacheMap.set(playerData.id, { rank: playerData.rank, id: playerData.id, amount: playerData.amount });
	});
}

/**
 *
 * @param currencyName String The name of the currency that is being updated.
 */
function updateStore(currencyName: leaderboardCurrencies): void {
	Players.GetPlayers().forEach((player) => {
		const playerStore = retrieveStore(player);
		const storeState = playerStore.getState();
		let selectedCurrency: number;

		if (currencyName === "bans") {
			selectedCurrency = storeState.bans.bans;
		} else if (currencyName === "eggs") {
			selectedCurrency = storeState.eggs.eggs;
		} else {
			warn(`Could not get amount for currency for ${currencyName} for ${player.Name}`);
			return;
		}

		if (selectedCurrency > 0) {
			updateLeaderboardPlayerAmount(tostring(player.UserId), currencyName, selectedCurrency);
		}
	});

	const leaderboardData = getStores("bans");
	updateCachedStore(currencyName, leaderboardData);
}

/**
 *
 * @param currencyName The name of the currency which gets its leaderboard Updated.
 */
function updateLeaderboardUI(currencyName: leaderboardCurrencies): void {
	const cachedData = cachedLeaderboards.get(currencyName);
	if (cachedData === undefined) {
		return;
	}

	const lbFrame = ReplicatedStorage.FindFirstChild("ui")?.FindFirstChild("LeaderboardFrame");
	assert(lbFrame, `Could not find leaderboard frame`);

	const board = leaderboards.FindFirstChild(currencyName);
	assert(board, `Could not find leaderboard for ${currencyName}`);

	const boardUI = board.FindFirstChild("UI") as leaderboardUI;
	if (boardUI === undefined) {
		print("WHAT");
		return;
	}

	const clonedframe = lbFrame.Clone() as leaderboardFrameInterface;
	for (const [playerId, playerData] of pairs(cachedData)) {
		const plrId = tonumber(playerId);
		if (plrId !== undefined) {
			const playerName = Players.GetNameFromUserIdAsync(plrId);
			const playerIcon = Players.GetUserThumbnailAsync(
				plrId,
				Enum.ThumbnailType.HeadShot,
				Enum.ThumbnailSize.Size420x420,
			)[0];

			clonedframe.NameLabel.Text = playerName ?? `ERROR GETTING NAME`;
			clonedframe.AmountLabel.Text = tostring(playerData.amount);
			clonedframe.PlayerIcon.Pos.Label.Text = tostring(playerData.rank + 1);
			clonedframe.PlayerIcon.Icon.Image = playerIcon;
			clonedframe.Parent = boardUI.Main.Leaderboard.List;
		}
	}
}

/**
 *
 * @param currencyName Name of the currency which has a leaderboard that gets cleaned.
 */
function cleanLeaderboardUI(currencyName: leaderboardCurrencies): void {
	const board = leaderboards.FindFirstChild(currencyName);
	assert(board, `Could not find leaderboard for ${currencyName}`);

	const boardUI = board.FindFirstChild("UI") as leaderboardUI;
	if (boardUI === undefined) {
		return;
	}

	for (const [, frame] of pairs(boardUI.Main.Leaderboard.List.GetChildren())) {
		if (frame.IsA("Frame")) {
			frame.Destroy();
		}
	}
}

task.spawn(() => {
	while (UPDATE_LEADERBOARDS) {
		updateStore("bans");
		cleanLeaderboardUI("bans");
		updateLeaderboardUI("bans");
		task.wait(UPDATE_TIME);
	}
});
