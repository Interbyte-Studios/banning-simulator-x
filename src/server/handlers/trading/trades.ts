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

/**
 * All the types of trades possible.
 */
type Trade = PendingTrade;

/**
 * The statuses possible of a `Trade`.
 */
enum TradeStatus {
	TradeSent,
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
 * Retrieves a player's current trade status.
 *
 * @param player The player to get the trade status of.
 * @returns The status of the player's trade, if it existed.
 */
export function getTradeStatus(player: Player): TradeStatus | undefined {
	return currentTrades.get(player)?.status;
}
