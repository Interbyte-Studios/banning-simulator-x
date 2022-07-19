import { createContext } from "@rbxts/roact";
import { ToggleAutoHatchDefinition } from "shared/remotes/eggs/toggleAuto";
import { RedeemQuestDefinition } from "shared/remotes/redeemQuest";
import { EquipWeaponDefinition } from "shared/remotes/weapons/equipWeapon";
import { PurchaseWeaponDefinition } from "shared/remotes/weapons/purchaseWeapon";

import { fakeHatchEgg } from "../hatchEgg";
import { fakeRemoteCall } from "./fakeRemoteCall";

export const fakeRemoteContext = {
	equipWeapon: fakeRemoteCall<EquipWeaponDefinition>("equipWeapon"),
	purchaseWeapon: fakeRemoteCall<PurchaseWeaponDefinition>("purchaseWeapon"),

	hatchEgg: fakeHatchEgg,
	toggleAuto: fakeRemoteCall<ToggleAutoHatchDefinition>("toggleAuto"),

	redeemQuest: fakeRemoteCall<RedeemQuestDefinition>("redeemQuest"),
};

export const remoteContext = createContext(fakeRemoteContext);
