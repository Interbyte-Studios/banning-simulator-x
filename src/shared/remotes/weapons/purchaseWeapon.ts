import Net from "@rbxts/net";

export const purchaseWeaponDefinition = Net.Definitions.ServerAsyncFunction<(weaponId: number) => boolean>();
export type PurchaseWeaponDefinition = typeof purchaseWeaponDefinition;
