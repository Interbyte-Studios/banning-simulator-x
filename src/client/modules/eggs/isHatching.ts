let isHatching = false;

/**
 * @param value Whether or not the player is hatching or not.
 */
export const setIsHatching = (value: boolean): void => {
	isHatching = value;
};

/**
 * @returns Returns whether or not the player is hatching.
 */
export const getIsHatching = (): boolean => {
	return isHatching;
};
