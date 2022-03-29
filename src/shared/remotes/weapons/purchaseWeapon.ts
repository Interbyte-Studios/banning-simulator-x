import Net from "@rbxts/net";
import { PurchaseWeaponFailure } from "shared/enums/purchaseWeaponFailure";

export const purchaseWeaponDefinition =
	Net.Definitions.ServerAsyncFunction<
		(weaponId: number) => Promise<{ success: true } | { success: false; reason: PurchaseWeaponFailure }>
	>();
export type PurchaseWeaponDefinition = typeof purchaseWeaponDefinition;
