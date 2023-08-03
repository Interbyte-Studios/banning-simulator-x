import { currencies, Currency } from "shared/configs/currencies";

debug.setmemorycategory("autoFightModule");
let manualAutoFightEnabled = false;
let purchasedAutoFightEnabled = false;

/**
 * Updates the manual auto fight setting.
 *
 * @param value Whether or not manual auto fight is enabled.
 */
export const setManualAutoFight = (value: boolean): void => {
	manualAutoFightEnabled = value;
};

/**
 * Updates the purchased auto fight setting.
 *
 * @param value Whether or not purchased auto fight is enabled.
 */
export const setPurchasedAutoFight = (value: boolean): void => {
	purchasedAutoFightEnabled = value;
};

/**
 * Gets the manual auto fight state.
 *
 * @returns Whether or not manual auto fight is enabled.
 */
export const getManualAutoFightState = (): boolean => {
	return manualAutoFightEnabled;
};

/**
 * Gets the purchased auto fight state.
 *
 * @returns Whether or not purchased auto fight is enabled.
 */
export const getPurchasedAutoFightState = (): boolean => {
	return purchasedAutoFightEnabled;
};

export interface AutoFightCache {
	obtainedCurrency: Array<{ name: Currency; amount: number }>;
	bans: number;
}
let focusedNpc: Humanoid | undefined;
let autoFightCache: AutoFightCache = {
	obtainedCurrency: currencies.map((value) => {
		return { name: value, amount: 0 };
	}),
	bans: 0,
};

/**
 * Sets the NPC to focus.
 *
 * @param npc The NPC to focus.
 */
export const setFocusedNPC = (npc: Humanoid | undefined): void => {
	focusedNpc = npc;
};

/**
 * Gets the NPC that is focused.
 *
 * @returns The NPC that is focused.
 */
export const getFocusedNPC = (): Humanoid | undefined => {
	return focusedNpc;
};

/**
 * Sets the auto fight cache.
 *
 * @param cache The cache to set.
 */
export const setAutoFightCache = (cache: AutoFightCache): void => {
	autoFightCache = cache;
};

/**
 * Gets the auto fight cache.
 *
 * @returns The auto fight cache.
 */
export const getAutoFightCache = (): AutoFightCache => {
	return autoFightCache;
};
