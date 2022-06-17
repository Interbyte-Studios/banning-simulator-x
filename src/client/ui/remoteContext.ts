import { AsyncServerFunctionDeclaration, ClientToServerEventDeclaration } from "@rbxts/net/out/definitions/Types";
import { createContext } from "@rbxts/roact";
import { HatchEggDefinition } from "shared/remotes/eggs/hatchEgg";
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

/**
 * Creates a fake dummy ClientToServer AsyncRemoteFunction.
 *
 * @param name The name of the dummy RemoteFunction.
 * @param dummyCall A dummy handler to handle the callback.
 * @returns A dummy RemoteFunction.
 */
function fakeFunctionCall<T extends AsyncServerFunctionDeclaration<Array<unknown>, unknown>>(
	name: string,
	dummyCall: (
		...args: T extends AsyncServerFunctionDeclaration<infer R, unknown> ? R : never
	) => T extends AsyncServerFunctionDeclaration<Array<unknown>, infer P> ? P : never,
): {
	CallServerAsync(
		...args: T extends AsyncServerFunctionDeclaration<infer R, unknown> ? R : never
	): T extends AsyncServerFunctionDeclaration<Array<unknown>, infer P> ? P : never;
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
		): T extends AsyncServerFunctionDeclaration<Array<unknown>, infer P> ? P : never {
			print(`Attempt to CallServerAsync on remote ${name}`);
			return dummyCall(...args);
		},
	};
}

export const fakeRemoteContext = {
	equipWeapon: fakeRemoteCall<EquipWeaponDefinition>("equipWeapon"),
	purchaseWeapon: fakeRemoteCall<PurchaseWeaponDefinition>("purchaseWeapon"),

	hatchEgg: fakeFunctionCall<HatchEggDefinition>("hatchEgg", () => {
		return { success: false };
	}),
};

export const remoteContext = createContext(fakeRemoteContext);
