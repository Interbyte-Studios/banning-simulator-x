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
	currentTrades.delete(receiver);
	currentTrades.delete(creator);

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
