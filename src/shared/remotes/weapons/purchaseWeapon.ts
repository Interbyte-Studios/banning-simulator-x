import Net from "@rbxts/net";
import { PurchaseWeaponFailure } from "shared/enums/purchaseWeaponFailure";

export const purchaseWeaponDefinition =
	Net.Definitions.ServerAsyncFunction<
		(weaponId: number) => Promise<{ success: true } | { success: false; reason: PurchaseWeaponFailure }>
	>();
export type PurchaseWeaponDefinition = typeof purchaseWeaponDefinition;

/*

export const purchaseWeaponDefinition = Net.Definitions.ClientToServerEvent<[weaponId: number]>([
	createTypeChecker(t.integer),
]);
export type EquipWeaponDefinition = typeof equipWeaponDefinition;

*/
