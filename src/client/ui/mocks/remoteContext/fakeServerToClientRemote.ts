import { ServerToClientEventDeclaration } from "@rbxts/net/out/definitions/Types";
import Signal from "@rbxts/signal";

type NetServerToClient = ServerToClientEventDeclaration<Array<unknown>>;

const isFakeRemote: unique symbol = {} as never;

interface FakeServerToClientRemote<T extends NetServerToClient> {
	Connect(
		callback: (...args: T extends ServerToClientEventDeclaration<infer U> ? U : never) => void,
	): RBXScriptConnection;
}

/**
 * We create a wrapper over the FakeServerToClientRemote so that our public exposure of
 * `fakeServerToClientRemote` is of the same type as what Net has (which does not contain
 * `.Fire` for the client), but internally we ensure that we have the `.Fire` command for
 * use in `fireFakeServerToClientRemote`.
 */
type InternalFakedServerToClientRemote<T extends NetServerToClient> = FakeServerToClientRemote<T> & {
	[isFakeRemote]: true;

	Fire: (...args: T extends ServerToClientEventDeclaration<infer U> ? U : never) => void;
};

/**
 * Creates a fake dummy ServerToClient remote.
 *
 * @returns A dummy remote.
 */
export function fakeServerToClientRemote<
	T extends ServerToClientEventDeclaration<Array<unknown>>,
>(): FakeServerToClientRemote<T> {
	// Create a new Signal instance to simulate OnClientEvent
	const signal = new Signal<(...args: T extends ServerToClientEventDeclaration<infer U> ? U : never) => void>();

	const remote: InternalFakedServerToClientRemote<T> = {
		[isFakeRemote]: true,

		/**
		 * Connects to a fake signal.
		 *
		 * @param callback The callback to run whenever the signal is triggered.
		 * @returns The connection to disconnect from the callback calls.
		 */
		Connect(
			callback: (...args: T extends ServerToClientEventDeclaration<infer U> ? U : never) => void,
		): RBXScriptConnection {
			return signal.Connect(callback);
		},

		/**
		 * Fires the fake signal.
		 *
		 * @param args The arguments to fire to the fake signal.
		 * @returns Nothing.
		 */
		Fire: (...args): void => signal.Fire(...args),
	};

	return remote;
}

/**
 * Fires a fake remote with the specified arguments.
 *
 * @param _remote The fake remote created.
 * @param {...any} args The arguments to fire the remote with.
 */
export function fireFakeServerToClientRemote<T extends ServerToClientEventDeclaration<Array<unknown>>>(
	_remote: FakeServerToClientRemote<T>,
	...args: T extends ServerToClientEventDeclaration<infer U> ? U : never
): void {
	const remote: InternalFakedServerToClientRemote<T> = _remote as InternalFakedServerToClientRemote<T>;

	// first let's ensure that it's a fake remote
	if (remote[isFakeRemote] !== true) {
		throw `Attempt to fire a fake remote from the server on a non-fake remote.`;
	}

	remote.Fire(...args);
}
