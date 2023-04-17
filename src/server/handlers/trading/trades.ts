import { UnreachableCaseError } from "shared/util/unreachableCaseError";

const currentTrades: Map<Player, Trade> = new Map();

interface PendingTrade {
	/**
	 * The current status of the trade.
	 */
	status: TradeStatus.TradeSent;

	/**
	 * The sender of the trade request.
	 */
	sender: Player;
	/**
	 * The receiver of the trade request.
	 */
	receiver: Player;
}

export interface Trading {
	/**
	 * The current status of the trade.
	 */
	status: TradeStatus.Trading;

	items: [
		{
			/**
			 * The first player involved in the trade.
			 */
			player: Player;
			/**
			 * All the IDs of pets that are on offer.
			 */
			items: Array<string>;
		},
		{
			/**
			 * The second player involved in the trade.
			 */
			player: Player;
			/**
			 * All the IDs of pets that are on offer.
			 */
			items: Array<string>;
		},
	];
}

/**
 * All the types of trades possible.
 */
type Trade = PendingTrade | Trading;

/**
 * The statuses possible of a `Trade`.
 */
export enum TradeStatus {
	TradeSent,
	Trading,
}

/**
 * Creates a new trade for both players.
 *
 * @param sender The person creating the trade.
 * @param receiver The person receiving the trade request.
 */
export function createTrade(sender: Player, receiver: Player): void {
	const trade: Trade = {
		status: TradeStatus.TradeSent,
		sender,
		receiver,
	};

	for (const player of [sender, receiver]) {
		currentTrades.set(player, trade);
	}
}

/**
 * Converts a trade request into an active trade.
 *
 * @param receiver The receiver of the trade request who is accepting it.
 * @param creator The creator of the trade.
 */
export function acceptTrade(receiver: Player, creator: Player): void {
	const [receiverTrade, creatorTrade] = [currentTrades.get(receiver), currentTrades.get(creator)];

	// the creator and receiver should have a trade request together
	// receiver should be the receiver in the trade (to prevent creator attempting to accept on receiver's behalf)
	if (
		receiverTrade !== creatorTrade ||
		receiverTrade === undefined ||
		receiverTrade.status !== TradeStatus.TradeSent ||
		receiverTrade.receiver !== receiver
	) {
		return;
	}

	const newTradeStatus: Trading = {
		status: TradeStatus.Trading,
		items: [
			{
				player: creator,
				items: [],
			},
			{
				player: receiver,
				items: [],
			},
		],
	};

	// update status to the trading status
	for (const player of [receiver, creator]) {
		currentTrades.set(player, newTradeStatus);
	}
}

/**
 * Removes a trade from a player, and all related parties.
 *
 * @param player A player associated with the trade who is removing the trade.
 * @returns The players involved in the trade.
 */
export function removeTrade(player: Player): Array<Player> {
	const trade = currentTrades.get(player);

	let players;
	if (trade !== undefined) {
		// remove the trade if it exists
		switch (trade.status) {
			case TradeStatus.TradeSent: {
				players = [trade.receiver, trade.sender];
				break;
			}
			case TradeStatus.Trading: {
				players = [trade.items[0].player, trade.items[1].player];
				break;
			}
			default:
				throw new UnreachableCaseError(trade);
		}

		for (const trader of players) {
			currentTrades.delete(trader);
		}
	}

	return players ?? [];
}

/**
 * Rejects a trade sent from `creator` to `receiver`, deleting the trade status for both players.
 *
 * @param receiver The receiver of the trade request who is reject the trade.
 * @param creator The creator of the trade (initiated the trade request).
 * @returns If the trade request was rejected. If `false`, then there was no trade request between the two players.
 */
export function rejectTrade(receiver: Player, creator: Player): boolean {
	const [receiverTrade, creatorTrade] = [currentTrades.get(receiver), currentTrades.get(creator)];

	// the creator and receiver should have a trade request together
	// receiver should be the receiver in the trade (to prevent creator attempting to reject on receiver's behalf)
	if (
		receiverTrade !== creatorTrade ||
		receiverTrade === undefined ||
		receiverTrade.status !== TradeStatus.TradeSent ||
		receiverTrade.receiver !== receiver
	) {
		return false;
	}

	// delete the trade
	removeTrade(receiver);

	return true;
}

/**
 * Modifies the items on offer from a player for a specific trade.
 *
 * @param player The player who is modifying their trade.
 * @param newOffer The new items they want to put in the trade.
 * @returns If the attempt to modify items was accepted.
 */
export function modifyTrade(player: Player, newOffer: Trading["items"][number]["items"]): boolean {
	const trade = currentTrades.get(player);
	if (trade === undefined || trade.status !== TradeStatus.Trading) {
		return false;
	}

	const playerItems = trade.items.find((playerItems) => playerItems.player === player);
	if (!playerItems) {
		// this case should never happen
		return false;
	}

	playerItems.items = newOffer;
	return true;
}

/**
 * Retrieves the trade of a specific player.
 *
 * This should ONLY be called during tests.
 *
 * @param player The player to retrieve the trade status of.
 * @returns The player's current trade, if it exists.
 */
export function getTrade(player: Player): Readonly<Trade | undefined> {
	// check we are running tests
	assert(
		(_G as { ["__TESTEZ_RUNNING_TEST__"]: unknown | undefined })["__TESTEZ_RUNNING_TEST__"] !== undefined,
		"Running `getTrade` outside of test allows for uncontrolled mutation",
	);

	return currentTrades.get(player);
}

/**
 * Retrieves a player's current trade status.
 *
 * @param player The player to get the trade status of.
 * @returns The status of the player's trade, if it existed.
 */
export function getTradeStatus(player: Player): TradeStatus | undefined {
	return currentTrades.get(player)?.status;
}

/**
 * Retrieves the current items of a player in a trade.
 *
 * @param player The player who we want to retrieve their items.
 * @returns The player's items.
 */
export function getTradeItems(player: Player): Readonly<Trading["items"][number]["items"]> {
	const trade = currentTrades.get(player);
	if (trade === undefined || trade.status !== TradeStatus.Trading) {
		throw `Attempt to call getTradeItems on ${player} who is not in a trade.`;
	}

	const playerItems = trade.items.find((playerItems) => playerItems.player === player);
	if (playerItems === undefined) {
		throw `reached impossible case where ${player} had currentTrade but not in trade`;
	}

	return playerItems.items;
}

/**
 * Gets the counter-party involved in a trade.
 *
 * @param player The first player involved in a trade.
 * @returns The counter-party in the trade.
 */
export function getTradingCounterParty(player: Player): Player {
	const trade = currentTrades.get(player);
	if (trade === undefined || trade.status !== TradeStatus.Trading) {
		throw `Attempt to getTradingCounterParty for player ${player} who does not have an active trade`;
	}

	const counterParty = trade.items.find((p) => p.player !== player);
	if (counterParty === undefined) {
		throw `reached impossible case where ${player} is the player in both parts of a trade`;
	}

	return counterParty.player;
}
