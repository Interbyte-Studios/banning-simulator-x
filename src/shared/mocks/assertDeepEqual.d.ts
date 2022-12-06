/**
 * Compares two items to check if they are deeply equal, throwing an error if they are not.
 *
 * @param a The first item to check.
 * @param b The second item to check.
 */
export function assertDeepEqual<T>(a: T, b: T): void;
