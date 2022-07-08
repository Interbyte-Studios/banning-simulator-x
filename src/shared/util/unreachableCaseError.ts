/**
 * Error Handling.
 */
export class UnreachableCaseError {
	/**
	 * @param value Never value.
	 */
	constructor(value: never) {
		throw `Unreachable case: ${value}`;
	}
}
