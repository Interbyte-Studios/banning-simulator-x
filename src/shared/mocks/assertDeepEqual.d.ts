/**
 * Compares two objects to check if they are deeply equal, throwing an error if they are not.
 *
 * @param a The first object to check.
 * @param b The second object to check.
 */
export function assertDeepEqual<T extends object>(a: T, b: T): void;
