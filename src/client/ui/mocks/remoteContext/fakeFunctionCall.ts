import { AsyncServerFunctionDeclaration } from "@rbxts/net/out/definitions/Types";

/**
 * Creates a fake dummy ClientToServer AsyncRemoteFunction.
 *
 * @param name The name of the dummy RemoteFunction.
 * @param dummyCall A dummy handler to handle the callback.
 * @returns A dummy RemoteFunction.
 */
export function fakeFunctionCall<T extends AsyncServerFunctionDeclaration<Array<unknown>, unknown>>(
	name: string,
	dummyCall: (
		...args: T extends AsyncServerFunctionDeclaration<infer R, unknown> ? R : never
	) => T extends AsyncServerFunctionDeclaration<Array<unknown>, infer P> ? P : never,
): {
	CallServerAsync(
		...args: T extends AsyncServerFunctionDeclaration<infer R, unknown> ? R : never
	): Promise<T extends AsyncServerFunctionDeclaration<Array<unknown>, infer P> ? P : never>;
} {
	return {
		/**
		 * Outputs a fake attempted RemoteFunction call to send information and receive a response from the server.
		 *
		 * @param args The arguments to call the RemoteFunction with.
		 * @returns The result of the RemoteFunction.
		 */
		CallServerAsync(
			...args: T extends AsyncServerFunctionDeclaration<infer R, unknown> ? R : never
		): Promise<T extends AsyncServerFunctionDeclaration<Array<unknown>, infer P> ? P : never> {
			print(`Attempt to CallServerAsync on remote ${name}`);
			return Promise.resolve(dummyCall(...args));
		},
	};
}
