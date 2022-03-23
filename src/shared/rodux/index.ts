import Rodux from "@rbxts/rodux";

import { AurasActions, aurasReducer, AurasState } from "./auras";
import { CurrentAuraActions, currentAuraReducer, CurrentAuraState } from "./currentAura";
import { CurrentWeaponActions, currentWeaponReducer, CurrentWeaponState } from "./currentWeapon";
import { WeaponsActions, weaponsReducer, WeaponsState } from "./weapons";

export type StoreState = {
	auras: AurasState;
	currentAura: CurrentAuraState;
	currentWeapon: CurrentWeaponState;
	weapons: WeaponsState;
};
export type StoreActions = (CurrentWeaponActions | WeaponsActions | CurrentAuraActions | AurasActions) &
	Rodux.AnyAction;

export const storeReducer = Rodux.combineReducers<StoreState, StoreActions>({
	auras: aurasReducer,
	currentAura: currentAuraReducer,
	weapons: weaponsReducer,
	currentWeapon: currentWeaponReducer,
});

export type Store = Rodux.Store<StoreState, StoreActions>;
