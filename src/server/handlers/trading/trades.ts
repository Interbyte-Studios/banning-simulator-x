import { retrieveStore } from "server/playerStore";
import { MAX_TRADE_LOGS } from "shared/configs/game";
import { PlayerTradeItem } from "shared/configs/trading";
import { Store } from "shared/rodux";
import { awardCurrency } from "shared/rodux/currencies";
import { addPets, ConfirmedPet, deletePets } from "shared/rodux/pets";
import { removeTradeLog, SavedTrade, saveTrade } from "shared/rodux/tradeLogs";
import { getPetLevel } from "shared/util/getPetLevel";
import { UnreachableCaseError } from "shared/util/unreachableCaseError";

const currentTrades: Map<Player, Trade> = new Map();

interface TradedPet extends ConfirmedPet {
	bans: number;
	equipped: boolean;
	locked: boolean;
}

interface BaseTrade {
	status: TradeStatus;
	items?: [
		PlayerTradeItem & {
			/**
			 * The first player involved in the trade.
			 */
			player: Player;
		},
		PlayerTradeItem & {
			/**
			 * The second player involved in the trade.
			 */
			player: Player;
		},
	];
}

interface PendingTrade extends BaseTrade {
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

interface ActiveTrade extends BaseTrade {
	items: [
		PlayerTradeItem & {
			/**
			 * The first player involved in the trade.
			 */
			player: Player;
		},
		PlayerTradeItem & {
			/**
			 * The second player involved in the trade.
			 */
			player: Player;
		},
	];
}

export interface Trading extends ActiveTrade {
	/**
	 * The current status of the trade.
	 */
	status: TradeStatus.Trading;
}

interface ConfirmedTradeOffer extends ActiveTrade {
	/**
	 * The current status of the trade.
	 */
	status: TradeStatus.ConfirmedOffer;
}

interface ViewingFinalTrade extends ActiveTrade {
	/**
	 * The current status of the trade.
	 */
	status: TradeStatus.ViewingFinalizedTrade;
}

interface FinalizedTrade extends ActiveTrade {
	/**
	 * The current status of the trade.
	 */
	status: TradeStatus.Finalized;
}

/**
 * All the types of trades possible.
 */
type Trade = PendingTrade | Trading | ConfirmedTradeOffer | ViewingFinalTrade | FinalizedTrade;

/**
 * The statuses possible of a `Trade`.
 */
export enum TradeStatus {
	TradeSent,
	Trading,
	ConfirmedOffer,
	ViewingFinalizedTrade,
	Finalized,
}

type ActiveTradeStatus = {
	[K in keyof typeof TradeStatus]: (typeof TradeStatus)[K] extends "TradeSent" ? never : TradeStatus;
}[keyof typeof TradeStatus];

const activeTradeStatus: Set<ActiveTradeStatus> = new Set([
	TradeStatus.Trading,
	TradeStatus.ConfirmedOffer,
	TradeStatus.ViewingFinalizedTrade,
	TradeStatus.Finalized,
]);

/**
 * A type guard for the ActiveTrade interface.
 *
 * @param trade The trade to check.
 * @returns If the trade is an active trade.
 */
function isActiveTrade(trade: BaseTrade): trade is ActiveTrade {
	return activeTradeStatus.has(trade.status);
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
				pets: [],
				currency: undefined,
			},
			{
				player: receiver,
				pets: [],
				currency: undefined,
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
			case TradeStatus.Trading:
			case TradeStatus.ConfirmedOffer:
			case TradeStatus.ViewingFinalizedTrade:
			case TradeStatus.Finalized: {
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
 * @param store The player's store.
 * @param newOffer The new items they want to put in the trade.
 * @returns If the attempt to modify items was accepted.
 */
export function modifyTrade(player: Player, store: Store, newOffer: PlayerTradeItem): boolean {
	const trade = currentTrades.get(player);
	if (trade === undefined) {
		warn("Attempt to modify trade when not in a trade");
		return false;
	}

	if (trade.status === TradeStatus.ConfirmedOffer) {
		const otherPlayer = trade.items.find((playerItems) => playerItems.player !== player);
		if (otherPlayer === undefined) {
			return false;
		}

		// check to be sure other player is still in trading status, otherwise, cannot modify
		const otherPlayerTrade = currentTrades.get(otherPlayer.player);
		if (otherPlayerTrade === undefined || otherPlayerTrade.status !== TradeStatus.Trading) {
			return false;
		}

		// update the trade status to trading
		const newTradeStatus: Trading = {
			status: TradeStatus.Trading,
			items: trade.items,
		};

		currentTrades.set(player, newTradeStatus);
	} else if (trade.status === TradeStatus.Trading) {
		const otherPlayer = trade.items.find((playerItems) => playerItems.player !== player);
		if (otherPlayer === undefined) {
			return false;
		}

		// this case is for when the other player has confirmed their offer and we are modifying our offer
		const otherPlayerTrade = currentTrades.get(otherPlayer.player);
		if (otherPlayerTrade !== undefined && otherPlayerTrade.status === TradeStatus.ConfirmedOffer) {
			warn("Set other player to trading status");
			// update the trade status to trading for other player
			const newTradeStatus: Trading = {
				status: TradeStatus.Trading,
				items: otherPlayerTrade.items,
			};

			currentTrades.set(otherPlayer.player, newTradeStatus);
		}
	}

	if (trade.status !== TradeStatus.Trading && trade.status !== TradeStatus.ConfirmedOffer) {
		warn(`Attempt to modify trade when not in a trade | Incorrect Status: ${trade.status}`);
		return false;
	}

	const playerItems = trade.items.find((playerItems) => playerItems.player === player);
	if (!playerItems) {
		// this case should never happen
		return false;
	}

	// ensure if currency was specified, the player has enough
	if (
		newOffer.currency === undefined ||
		newOffer.currency.amount > store.getState().currencies[newOffer.currency.type]
	) {
		return false;
	}

	// validate player has the pets they own
	if (!newOffer.pets.every((pet) => store.getState().pets.find((storePet) => storePet.guid === pet) !== undefined)) {
		return false;
	}

	// ensure that the pet guids are unique
	if (new Set(newOffer.pets).size() !== newOffer.pets.size()) {
		return false;
	}

	playerItems.pets = newOffer.pets;
	playerItems.currency = newOffer.currency;

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
export function getTradeItems(player: Player): Readonly<PlayerTradeItem> {
	const trade = currentTrades.get(player);
	if (trade === undefined || !isActiveTrade(trade)) {
		throw `Attempt to call getTradeItems on ${player} who is not in a trade.`;
	}

	const playerItems = trade.items.find((playerItems) => playerItems.player === player);
	if (playerItems === undefined) {
		throw `reached impossible case where ${player} had currentTrade but not in trade`;
	}

	return {
		pets: playerItems.pets,
		currency: playerItems.currency,
	};
}

/**
 * Gets the counter-party involved in a trade.
 *
 * @param player The first player involved in a trade.
 * @returns The counter-party in the trade.
 */
export function getTradingCounterParty(player: Player): Player {
	const trade = currentTrades.get(player);
	if (trade === undefined || !isActiveTrade(trade)) {
		throw `Attempt to getTradingCounterParty for player ${player} who does not have an active trade`;
	}

	const counterParty = trade.items.find((p) => p.player !== player);
	if (counterParty === undefined) {
		throw `reached impossible case where ${player} is the player in both parts of a trade`;
	}

	return counterParty.player;
}

/**
 * Confirms a trade offer from a player.
 *
 * @param player The player who is confirming their trade offer.
 * @returns If the trade offer was confirmed.
 */
export function confirmTradeOffer(player: Player): boolean {
	const trade = currentTrades.get(player);
	if (trade === undefined || trade.status !== TradeStatus.Trading) {
		return false;
	}

	// check if other player has confirmed their trade as well
	const otherPlayer = trade.items.find((playerItems) => playerItems.player !== player);
	if (otherPlayer === undefined) {
		return false;
	}

	const otherPlayerTrade = currentTrades.get(otherPlayer.player);
	if (otherPlayerTrade === undefined) {
		return false;
	}

	// set the status of both player's trades to "ViewingFinalizedTrade"
	if (otherPlayerTrade.status === TradeStatus.ConfirmedOffer) {
		const newTradeStatus: ViewingFinalTrade = {
			status: TradeStatus.ViewingFinalizedTrade,
			items: trade.items,
		};
		currentTrades.set(player, newTradeStatus);
		currentTrades.set(otherPlayer.player, newTradeStatus);
		return true;
	}

	// show the other player that this player has confirmed their trade offer
	if (otherPlayerTrade.status === TradeStatus.Trading) {
		const newTradeStatus: ConfirmedTradeOffer = {
			status: TradeStatus.ConfirmedOffer,
			items: trade.items,
		};
		currentTrades.set(player, newTradeStatus);
		return true;
	}

	return false;
}

/**
 * Declines a trade offer from a player (exits the trade similarly to if they'd rejected it in the first place).
 *
 * @param player The player who is declining the trade offer.
 * @returns If the trade offer was declined.
 */
export function declineTradeOffer(player: Player): boolean {
	const trade = currentTrades.get(player);
	if (trade === undefined) {
		throw `Attempt to call declineTradeOffer on ${player} who is not in a trade.`;
	}

	// make sure they're in a trade
	// this shouldn't work if they're viewing the finalized offer (that'd be a different remote)
	if (trade.status !== TradeStatus.Trading && trade.status !== TradeStatus.ConfirmedOffer) {
		warn("Incorrect trade status");
		return false;
	}

	// get other player's trade as well
	const otherPlayer = trade.items.find((playerItems) => playerItems.player !== player);
	if (otherPlayer === undefined) {
		throw `reached impossible case where ${player} is the player in both parts of a trade`;
	}

	const otherPlayerTrade = currentTrades.get(otherPlayer.player);
	if (otherPlayerTrade === undefined) {
		throw `${player} attempted to decline trade offer, but other player ${otherPlayer.player} did not have a trade`;
	}

	if (otherPlayerTrade.status !== TradeStatus.Trading && otherPlayerTrade.status !== TradeStatus.ConfirmedOffer) {
		warn("Other player has an incorrect trade status");
		return false;
	}

	// remove the trade
	warn("Declined and removed the trade from registry");
	removeTrade(player);
	return true;
}

/**
 *  Confirms a finalized trade from a player.
 *
 * @param player The player who is confirming their finalized trade.
 * @param store The player's store.
 * @returns If the finalized trade was confirmed.
 */
export function confirmFinalizedTradeOffer(player: Player, store: Store): boolean {
	const trade = currentTrades.get(player);
	if (trade === undefined || trade.status !== TradeStatus.ViewingFinalizedTrade) {
		return false;
	}

	// check if other player has finalized their trade as well
	const otherPlayer = trade.items.find((playerItems) => playerItems.player !== player);
	if (otherPlayer === undefined) {
		return false;
	}

	const otherPlayerTrade = currentTrades.get(otherPlayer.player);
	if (otherPlayerTrade === undefined) {
		return false;
	}

	// update the trade status for the player who is finalizing their offer
	const newTradeStatus: FinalizedTrade = {
		status: TradeStatus.Finalized,
		items: trade.items,
	};
	currentTrades.set(player, newTradeStatus);

	// if the other player is still viewing their offer, then we have to wait for them to finalize it to complete the trade
	if (otherPlayerTrade.status === TradeStatus.ViewingFinalizedTrade) {
		return true;
	}

	// if they aren't viewing the offer, they should have finalized their trade. otherwise, there was an issue.
	if (otherPlayerTrade.status !== TradeStatus.Finalized) {
		warn(
			`Player ${otherPlayer.player.Name} did not have a finalized trade, but wasn't viewing the final trade either.`,
		);
		return false;
	}

	// need to get the other players store here
	const otherPlayerStore = retrieveStore(otherPlayer.player);
	if (otherPlayerStore === undefined) {
		// this should never happen
		warn(`Player ${otherPlayer.player} did not have a store when finalizing trade`);
		return false;
	}

	// transfer the items and currency between the players
	const playerOffer = trade.items.find((item) => item.player === player);
	const otherPlayerOffer = trade.items.find((item) => item.player === otherPlayer.player);

	if (playerOffer && otherPlayerOffer) {
		// create tables of pets to transfer between players
		const playerOfferPets: Array<TradedPet> = [];
		for (const pet of playerOffer.pets) {
			const storedPet = store.getState().pets.find((storedPet) => storedPet.guid === pet);

			// we have to simply return in this case and not finish dispatching the trade, so nobody get's scammed
			if (storedPet === undefined) {
				warn(`Player ${player} attempted to finalize trade with pet ${pet} that they do not own`);
				return false;
			}

			playerOfferPets.push({ ...storedPet, autoDeleted: false, method: "trade" });
		}

		const otherPlayerOfferPets: Array<TradedPet> = [];
		for (const pet of otherPlayerOffer.pets) {
			const storedPet = otherPlayerStore.getState().pets.find((storedPet) => storedPet.guid === pet);

			// we have to simply return in this case and not finish dispatching the trade, so nobody get's scammed
			if (storedPet === undefined) {
				warn(`Player ${otherPlayer.player} attempted to finalize trade with pet ${pet} that they do not own`);
				return false;
			}

			otherPlayerOfferPets.push({ ...storedPet, autoDeleted: false, method: "trade" });
		}

		// remove the pets from the players
		store.dispatch(deletePets(playerOffer.pets));
		otherPlayerStore.dispatch(deletePets(otherPlayerOffer.pets));

		// add the new pets to the players
		store.dispatch(addPets(0, "coins", otherPlayerOfferPets));
		otherPlayerStore.dispatch(addPets(0, "coins", playerOfferPets));

		if (playerOffer.currency !== undefined) {
			// remove the currency from the player
			store.dispatch(awardCurrency(playerOffer.currency.type, -playerOffer.currency.amount));

			// add the currency to the other player
			otherPlayerStore.dispatch(awardCurrency(playerOffer.currency.type, playerOffer.currency.amount));
		}

		if (otherPlayerOffer.currency !== undefined) {
			// remove the currency from the other player
			otherPlayerStore.dispatch(awardCurrency(otherPlayerOffer.currency.type, -otherPlayerOffer.currency.amount));

			// add the currency to the player
			store.dispatch(awardCurrency(otherPlayerOffer.currency.type, otherPlayerOffer.currency.amount));
		}

		// log the trade for both players
		const tradeTimestamp = DateTime.now();
		const playerTrade = {
			currency: {
				currencyType: playerOffer.currency?.type ?? "coins",
				amount: playerOffer.currency?.amount ?? 0,
			},
			pets: playerOfferPets.map((pet) => {
				const petLevel = getPetLevel(pet) ?? 1;

				return {
					id: pet.id,
					variant: pet.variant,
					level: petLevel,
				};
			}),
		};
		const otherPlayerTrade = {
			currency: {
				currencyType: otherPlayerOffer.currency?.type ?? "coins",
				amount: otherPlayerOffer.currency?.amount ?? 0,
			},
			pets: otherPlayerOfferPets.map((pet) => {
				const petLevel = getPetLevel(pet) ?? 1;

				return {
					id: pet.id,
					variant: pet.variant,
					level: petLevel,
				};
			}),
		};

		if (store.getState().tradeLogs.size() >= MAX_TRADE_LOGS) {
			warn("Player Trade Logs:");
			let tradeToRemove: SavedTrade | undefined;
			store.getState().tradeLogs.forEach((trade) => {
				print(trade.timestamp.UnixTimestampMillis, tradeToRemove?.timestamp.UnixTimestamp);
				if (
					tradeToRemove === undefined ||
					trade.timestamp.UnixTimestampMillis < tradeToRemove.timestamp.UnixTimestampMillis
				) {
					tradeToRemove = trade;
				}
			});

			if (tradeToRemove) {
				store.dispatch(removeTradeLog(tradeToRemove));
			} else warn(`Failed to remove overflowing trade logs for player ${player.Name}`);
		}

		if (otherPlayerStore.getState().tradeLogs.size() >= MAX_TRADE_LOGS) {
			warn("Other Player Trade Logs:");
			let tradeToRemove: SavedTrade | undefined;
			otherPlayerStore.getState().tradeLogs.forEach((trade) => {
				print(trade.timestamp.UnixTimestampMillis, tradeToRemove?.timestamp.UnixTimestamp);
				if (
					tradeToRemove === undefined ||
					trade.timestamp.UnixTimestampMillis < tradeToRemove.timestamp.UnixTimestampMillis
				) {
					tradeToRemove = trade;
				}
			});

			if (tradeToRemove) {
				otherPlayerStore.dispatch(removeTradeLog(tradeToRemove));
			} else warn(`Failed to remove overflowing trade logs for player ${player.Name}`);
		}

		store.dispatch(saveTrade(otherPlayer.player.UserId, tradeTimestamp, otherPlayerTrade, playerTrade));
		otherPlayerStore.dispatch(saveTrade(player.UserId, tradeTimestamp, playerTrade, otherPlayerTrade));

		return true;
	}

	// there was an issue somewhere. throw an error since reverting the players back to trading status might cause issues
	// in this case (which should never happen), the clients will be unable to do anything, and therefore, should be reported to devs
	throw `There was an issue with finalizing the trade between ${player} and ${otherPlayer.player}`;
}

/**
 * Declines a finalized trade from a player.
 * Sends both players back to "Trading" status, where they must reconfirm their trade offer from the beginning.
 *
 * Important to note that once a player has finalized their offer, they're unable to decline the trade from then on.
 * This is to prevent players from scamming each other by accepting the trade, then declining it after the other player has finalized their offer.
 * This is also to prevent potential known issues such as duping.
 *
 * The exception to the case above is that, a player can decline the finalized offer if the other player has finalized their offer.
 * Only a player who has finalized their offer is unable to decline the finalized offer and send both players back to the Trading.
 * If neither player has finalized their offer, either player should be afforded the right to send the trade back to "Trading" status.
 *
 * @param player The player who is declining their finalized trade.
 * @returns If the finalized trade was declined.
 */
export function declineFinalizedTradeOffer(player: Player): boolean {
	const trade = currentTrades.get(player);
	if (trade === undefined || trade.status !== TradeStatus.ViewingFinalizedTrade) {
		return false;
	}

	// Update the trade status to trading for both players
	const otherPlayer = trade.items.find((playerItems) => playerItems.player !== player);
	if (otherPlayer === undefined) {
		return false;
	}

	// need to be sure the opposite player has either finalized their offer or is viewing the final offer. otherwise, there was an issue.
	// this case should never happen. it would require some investigation if it did
	const otherPlayerTrade = currentTrades.get(otherPlayer.player);
	if (
		otherPlayerTrade === undefined ||
		(otherPlayerTrade.status !== TradeStatus.ViewingFinalizedTrade && otherPlayerTrade.status !== TradeStatus.Finalized)
	) {
		return false;
	}

	// update the trade status to trading for both players
	const newTradeStatus: Trading = {
		status: TradeStatus.Trading,
		items: trade.items,
	};

	currentTrades.set(player, newTradeStatus);
	currentTrades.set(otherPlayer.player, newTradeStatus);

	return true;
}
