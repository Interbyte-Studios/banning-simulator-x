let amountOfPets = 0;

/**
 * Sets the number of pets the user has.
 *
 * @param amount The number of pets the user has.
 */
export const setAmountOfPets = (amount: number): void => {
	amountOfPets = amount;
};

/**
 * @returns The number of pets the user has.
 */
export const getAmountOfPets = (): number => {
	return amountOfPets;
};
