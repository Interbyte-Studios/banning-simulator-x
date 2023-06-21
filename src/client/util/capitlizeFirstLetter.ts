/**
 * Capitalizes the first letter of a string.
 *
 * @param value The string to capitalize.
 * @returns The capitalized string.
 */
export function capitalizeFirstLetter(value: string): string {
	const firstLetter = string.sub(value, 0, 0);
	const restOfWord = string.sub(value, 1);
	return string.upper(firstLetter) + restOfWord;
}
