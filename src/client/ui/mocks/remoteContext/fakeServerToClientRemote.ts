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
	OnClientEvent: Signal<(...args: T extends ServerToClientEventDeclaration<infer U> ? U : never) => void>;
} {
	// Create a new Signal instance to simulate OnClientEvent
	const onClientEvent = new Signal<(...args: T extends ServerToClientEventDeclaration<infer U> ? U : never) => void>();

	return {
		OnClientEvent: onClientEvent,
	};
}
