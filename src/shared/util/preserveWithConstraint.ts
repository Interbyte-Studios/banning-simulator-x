/**
 * Used to allow generic identities that align with a given type.
 *
 * @returns Any object that extends the given generic type when function is called.
 */
export function preserveWithConstraint<X>(): <T extends X>(value: T) => T {
	return <T extends X>(value: T) => {
		return value;
	};
}
