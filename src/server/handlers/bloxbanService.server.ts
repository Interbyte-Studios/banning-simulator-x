import { DataStoreService, HttpService, Players, RunService } from "@rbxts/services";
import { t } from "@rbxts/t";

const [authCodeSuccess, AUTH_CODE] = pcall(() => DataStoreService.GetDataStore("bloxban").GetAsync("AUTH_CODE"));
if (!authCodeSuccess) {
	throw `Roblox DataStores are down, failed to get BloxBan auth code`;
}

const BAN_URL = `https://api.bloxban.com/place/ban_list?game_id=8617208257&auth=${AUTH_CODE}&sv=1.0&data=`;
let BAN_MESSAGE = `You have been banned. | Reason: {reason} | Time: {time}`;

const UPDATE_INTERVAL = 60;

let banList: Array<Ban> = [];

const isSettingsValue = t.strictInterface({
	Default_Message: t.string,
});
const isBan = t.strictInterface({
	rbx_id: t.number,
	rbx_username: t.string,
	ban_reason: t.optional(t.string),
	ban_time: t.optional(t.string),
});
type Ban = t.static<typeof isBan>;
const isBanList = t.map(t.string, t.union(isSettingsValue, isBan));

/**
 * Compiles a list of all the player user ids in the server and converts it into a JSON.
 *
 * @returns Compiled list in JSON format.
 */
function getUsersArray(): string {
	const playerIds = Players.GetPlayers().map((player) => player.UserId);

	return HttpService.JSONEncode(playerIds);
}

/**
 * Updates the cached ban list on the server.
 */
function updateBanList(): void {
	const [getBanSuccess, serializedBanList] = pcall(() => HttpService.GetAsync(`${BAN_URL}${getUsersArray()}`));
	if (!getBanSuccess) {
		warn("Failed to get ban list from BloxBan");
		return;
	}

	const [newBanListSuccess, newDeserializedBanList] = pcall(() => HttpService.JSONDecode(serializedBanList));
	if (newBanListSuccess) {
		print(newDeserializedBanList);
	}

	if (!(newBanListSuccess && isBanList(newDeserializedBanList))) {
		warn(`Failed to decode ban list to JSON format`);
		return;
	}

	const newBanList = [];

	for (const [key, value] of pairs(newDeserializedBanList)) {
		if (key === "Settings") {
			if (isSettingsValue(value)) {
				BAN_MESSAGE = value.Default_Message;
			}
			continue;
		}

		if (isBan(value)) {
			newBanList.push(value);
			continue;
		}

		throw `Unknown value: ${HttpService.JSONEncode(value)}`;
	}

	banList = newBanList;
}

/**
 * Checks if a specified player is on the ban list.
 * If the player is on the ban list, they are kicked.
 *
 * @param player The player.
 */
function checkPlayer(player: Player): void {
	const banData = banList.find((b) => b.rbx_id === player.UserId);
	if (!banData) {
		return;
	}

	player.Kick(
		BAN_MESSAGE.gsub("{reason}", banData.ban_reason ?? "No reason given")[0].gsub(
			"{time}",
			banData.ban_time ?? "Unknown duration",
		)[0],
	);
}

Players.PlayerAdded.Connect(checkPlayer);

let lastUpdateTime = 0;
RunService.Heartbeat.Connect(() => {
	if (os.clock() - lastUpdateTime < UPDATE_INTERVAL) {
		return;
	}

	lastUpdateTime = os.clock();
	task.defer(() => {
		updateBanList();
		Players.GetPlayers().forEach(checkPlayer);
	});
});
