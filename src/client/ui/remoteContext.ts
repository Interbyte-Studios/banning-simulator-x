import { AsyncServerFunctionDeclaration, ClientToServerEventDeclaration } from "@rbxts/net/out/definitions/Types";
import { createContext } from "@rbxts/roact";
import { EquipWeaponDefinition } from "shared/remotes/weapons/equipWeapon";
import { PurchaseWeaponDefinition } from "shared/remotes/weapons/purchaseWeapon";

/**
 * Creates a fake dummy ClientToServer remote.
 *
 * @param name The name of the remote.
 * @returns A dummy remote.
 */
function fakeRemoteCall<T extends ClientToServerEventDeclaration<Array<unknown>>>(
	name: string,
): {
	SendToServer: (...args: T extends ClientToServerEventDeclaration<infer U> ? U : never) => void;
} {
	return {
		/**
		 * Outputs a fake attempted call to send information to the server.
		 *
		 * @param args The args to send to the server.
		 */
		SendToServer: (...args): void => {
			print(`Attempt to SendToServer on remote ${name} with args:`, args);
		},
	};
}

/**
 * Creates a fake dummy ClientToServer remote.
 *
 * @param name The name of the remote.
 * @returns A dummy remote.
 */
function fakeServerFunctionCall<T extends AsyncServerFunctionDeclaration<Array<unknown>, unknown>>(
	name: string,
): {
	CallServerAsync: (...args: T extends AsyncServerFunctionDeclaration<infer U, infer Z> ? U : never) => void;
} {
	return {
		/**
		 * Outputs a fake attempted call to send information to the server.
		 *
		 * @param args The args to send to the server.
		 */
		CallServerAsync: (...args): void => {
			print(`Attempt to CallServerAsync on remote ${name} with args:`, args);
		},
	};
}

export const fakeRemoteContext = {
	equipWeapon: fakeRemoteCall<EquipWeaponDefinition>("equipWeapon"),
	purchaseWeapon: fakeServerFunctionCall<PurchaseWeaponDefinition>("purchaseWeapon"),
};

export const remoteContext = createContext(fakeRemoteContext);
