import { t } from "@rbxts/t";
import { isVariant } from "shared/configs/pets";

export const isflaggedPetCollection = t.array(
	t.interface({
		id: t.number,
		variant: isVariant,
	}),
);
export type FlaggedPetCollection = t.static<typeof isflaggedPetCollection>;

export const isFlaggedTrade = t.strictInterface({
	playerWhoOffered: t.number,
	playerWhoAccepted: t.number,

	petsOffered: isflaggedPetCollection,
});
export type FlaggedTrade = t.static<typeof isFlaggedTrade>;

export const isFlaggedRarity = t.literal("Exclusive", "Secret", "Primordial");
export type FlaggedRarity = t.static<typeof isFlaggedRarity>;

export const isFlaggedSecretVariant = t.literal("radiant");
export type FlaggedSecretVariant = t.static<typeof isFlaggedSecretVariant>;

export type FlaggedTradeCollection = Array<FlaggedTrade>;

const flaggedTrades: FlaggedTradeCollection = [];

/**
 * Adds a trade to the flagged trades list.
 *
 * @param trade The trade to check.
 */
export function addFlaggedTrade(trade: FlaggedTrade): void {
	if (isFlaggedTrade(trade)) {
		flaggedTrades.insert(flaggedTrades.size(), trade);
	}
}

/**
 * @returns The flagged trades list.
 */
export function getFlaggedTrades(): FlaggedTradeCollection {
	return flaggedTrades;
}

/**
 * Removes a trade from the flagged trades list.
 *
 * @param index The index of the trade to remove.
 */
export function removeFlaggedTrade(index: number): void {
	flaggedTrades.remove(index);
}
