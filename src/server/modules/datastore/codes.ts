import { t } from "@rbxts/t";
import { isCurrency } from "shared/configs/currencies";
import { isBoost } from "shared/configs/game";
import { isVariant } from "shared/configs/pets";
import { validBoostTime } from "shared/rodux/boosts";

export const isValidCode = t.strictInterface({
	name: t.string,
	reward: t.interface({
		currency: t.interface({
			name: isCurrency,
			amount: t.integer,
		}),
		boosts: t.array(
			t.interface({
				name: isBoost,
				time: validBoostTime,
			}),
		),
		pets: t.array(
			t.interface({
				id: t.number,
				variant: isVariant,
			}),
		),
	}),
});
export type ValidCode = t.static<typeof isValidCode>;

export const isValidStoredCodeCache = t.array(isValidCode);
export type StoredCodes = t.static<typeof isValidStoredCodeCache>;

let codesCache: StoredCodes = [];

/**
 * Overwrites and sets the server code cache.
 *
 * @param newCache The new cache of codes.
 */
export const setCodesCache = (newCache: StoredCodes): void => {
	codesCache = newCache;
};

/**
 * Returns the server code cache.
 *
 * @returns The server cache of valid media codes.
 */
export const getCodesCache = (): StoredCodes => {
	return codesCache;
};
