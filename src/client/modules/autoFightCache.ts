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
