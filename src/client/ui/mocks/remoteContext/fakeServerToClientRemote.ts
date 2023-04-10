import { ServerToClientEventDeclaration } from "@rbxts/net/out/definitions/Types";
import Signal from "@rbxts/signal";

/**
 * Creates a fake dummy ServerToClient remote.
 *
 * @param name The name of the remote.
 * @returns A dummy remote.
 */
export function fakeServerToClientRemote<T extends ServerToClientEventDeclaration<Array<unknown>>>(
	name: string,
): {
	Connect: (
		callback: (...args: T extends ServerToClientEventDeclaration<infer U> ? U : never) => RBXScriptSignal,
	) => void;
} {
	return {
		/**
		 * Connects to a fake signal.
		 *
		 * @param callback The callback to run whenever the signal is triggered.
		 * @returns The connection to disconnect from the callback calls.
		 */
		Connect: (
			callback: (...args: T extends ServerToClientEventDeclaration<infer U> ? U : never) => void,
		): RBXScriptConnection => {
			// Create a new Signal instance to simulate OnClientEvent
			const signal = new Signal<(...args: T extends ServerToClientEventDeclaration<infer U> ? U : never) => void>();

			// todo: expose signal.Fire

			return signal.Connect(callback);
		},
	};
}
