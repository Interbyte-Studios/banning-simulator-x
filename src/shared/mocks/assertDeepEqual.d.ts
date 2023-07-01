/**
 * Compares two items to check if they are deeply equal, throwing an error if they are not.
 *
 * @param a The first item to check.
 * @param b The second item to check.
 * @param message An optional custom error message to display if the two values are not deep equal.
 * @default message "Values were not deep equal"
 */
export function assertDeepEqual<T>(a: T, b: T, message?: string): void;
