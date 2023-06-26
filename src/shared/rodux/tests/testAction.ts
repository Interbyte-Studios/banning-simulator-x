import { deepCopy } from "@rbxts/object-utils";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";

import { StoreActions } from "..";

/**
 * Checks that a given reducer will produce a result such that inputting the `beforeState` and `args` will yield `afterState`.
 *
 * An additional check is performed to ensure that `beforeState` is not mutated, as otherwise this violates Rodux's policy of immutability.
 *
 * @param beforeState The state before running the action.
 * @param afterState The state after running the action.
 * @param reducer The reducer to run.
 * @param action The action to run in the reducer.
 */
export function testAction<T, A extends StoreActions>(
	beforeState: T,
	afterState: T,
	reducer: (initialState: T, action: A) => T,
	action: A,
): void {
	const savedBeforeState = typeIs(beforeState, "table") ? deepCopy(beforeState) : beforeState;
	const result = reducer(beforeState, action);

	// check that the reducer produced the expect state value after
	assertDeepEqual(result, afterState, "Unexpected result after running reducer");
	// check that the reducer did not mutate the original input
	assertDeepEqual(savedBeforeState, beforeState, "Original state mutated when running reducer");
}
