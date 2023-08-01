debug.setmemorycategory("lastHatchModule");
let lastHatch = 0;

/**
 * Sets the last hatch time.
 *
 * @param time Time to set.
 */
export const setLastHatch = (time: number): void => {
	lastHatch = time;
};

/**
 * Returns the last hatch time.
 *
 * @returns {number} LastHatch.
 */
export const getLastHatch = (): number => {
	return lastHatch;
};
