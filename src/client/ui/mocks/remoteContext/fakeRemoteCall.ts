import { ClientToServerEventDeclaration } from "@rbxts/net/out/definitions/Types";

/**
 * Creates a fake dummy ClientToServer remote.
 *
 * @param name The name of the remote.
 * @returns A dummy remote.
 */
export function fakeRemoteCall<T extends ClientToServerEventDeclaration<Array<unknown>>>(
	name: string,
): {
	SendToServer(...args: T extends ClientToServerEventDeclaration<infer U> ? U : never): void;
} {
	return {
		/**
		 * Outputs a fake attempted call to send information to the server.
		 *
		 * @param args The args to send to the server.
		 */
		SendToServer(...args): void {
			print(`Attempt to SendToServer on remote ${name} with args:`, args);
		},
	};
}
