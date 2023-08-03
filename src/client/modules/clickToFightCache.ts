let clickToFightEnabled = true;

/**
 * Sets whether or not click to fight is enabled.
 *
 * @param enabled Whether or not click to fight should be enabled.
 */
export const setClickToFightEnabled = (enabled: boolean): void => {
	clickToFightEnabled = enabled;
};

/**
 * @returns Whether or not click to fight is enabled.
 */
export const getClickToFightEnabled = (): boolean => {
	return clickToFightEnabled;
};
