import Rodux from "@rbxts/rodux";
import { StoreActions } from "shared/rodux";

/**
 * Creates some middleware which tracks actions dispatched to the Rodux store.
 *
 * @returns The actions dispatched to the store at the time of reading, as well as the middleware to apply to the store to track these changes.
 */
export function createSpyMiddleware(): {
	dispatchedActions: Array<StoreActions>;
	middleware: Rodux.Middleware;
} {
	const dispatchedActions: Array<StoreActions> = [];

	return {
		dispatchedActions,
		// eslint-disable-next-line jsdoc/require-jsdoc
		middleware: (nextDispatch: Rodux.Dispatch<StoreActions>) => {
			return (action: StoreActions): void => {
				nextDispatch(action);

				dispatchedActions.push(action);
			};
		},
	};
}
