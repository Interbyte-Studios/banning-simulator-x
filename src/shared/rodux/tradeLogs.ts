import Rodux from "@rbxts/rodux";
import { Currency } from "shared/configs/currencies";
import { Variants } from "shared/configs/pets";

export interface SavedTradeCurrency {
	currencyType: Currency;
	amount: number;
}

export interface SavedTradePet {
	id: number;
	variant: Variants;
	level: number;
}

export interface SavedTradeOffer {
	currency: SavedTradeCurrency;
	pets: Array<SavedTradePet>;
}

export interface SavedTrade {
	otherPlayerId: number;
	timestamp: DateTime;
	otherOffer: SavedTradeOffer;
	localOffer: SavedTradeOffer;
}

export type TradeLogsState = Array<SavedTrade>;
export type TradeLogActions = SaveTrade | RemoveTradeLog;

export interface SaveTrade extends Rodux.Action<"saveTrade"> {
	otherPlayerId: number;
	timestamp: DateTime;
	otherOffer: SavedTradeOffer;
	localOffer: SavedTradeOffer;
}

export interface RemoveTradeLog extends Rodux.Action<"removeTradeLog"> {
	savedTrade: SavedTrade;
}

/**
 * @param otherPlayerId The id of the player the trade was with.
 * @param timestamp The time the trade was made.
 * @param otherOffer The offer the other player made.
 * @param localOffer The offer the local player made.
 * @returns The Rodux action to dispatch.
 */
export function saveTrade(
	otherPlayerId: number,
	timestamp: DateTime,
	otherOffer: SavedTradeOffer,
	localOffer: SavedTradeOffer,
): SaveTrade & Rodux.AnyAction {
	return {
		type: "saveTrade",
		otherPlayerId,
		timestamp,
		otherOffer,
		localOffer,
	};
}

/**
 * Removes a trade from the trade logs.
 *
 * @param savedTrade The trade to remove.
 * @returns The Rodux action to dispatch.
 */
export function removeTradeLog(savedTrade: SavedTrade): RemoveTradeLog & Rodux.AnyAction {
	return {
		type: "removeTradeLog",
		savedTrade,
	};
}

export const defaultTradeLogs: TradeLogsState = [];

/* eslint-disable jsdoc/require-jsdoc */
export const tradeLogsReducer = Rodux.createReducer<TradeLogsState, TradeLogActions>(defaultTradeLogs, {
	saveTrade: (state, action) => {
		const newState = [...state];

		const newTrade: SavedTrade = {
			otherPlayerId: action.otherPlayerId,
			timestamp: action.timestamp,
			otherOffer: action.otherOffer,
			localOffer: action.localOffer,
		};

		newState.push(newTrade);
		return newState;
	},
	removeTradeLog: (state, action) => {
		const newState = [...state];

		const tradeToRemove = newState.findIndex((trade) => trade === action.savedTrade);
		if (tradeToRemove === -1) {
			warn(`[ Trade Logs Reducer | Remove Trade Log ] - Could not find trade to remove: ${action.savedTrade}`);
			return newState;
		}

		newState.unorderedRemove(tradeToRemove);
		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
