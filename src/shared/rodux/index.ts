import Rodux from "@rbxts/rodux";

import { CurrentWeaponActions, currentWeaponReducer, CurrentWeaponState } from "./currentWeapon";
import { WeaponsActions, weaponsReducer, WeaponsState } from "./weapons";

export type StoreState = {
	currentWeapon: CurrentWeaponState;
	weapons: WeaponsState;
};
export type StoreActions = CurrentWeaponActions | WeaponsActions;

export const storeReducer = Rodux.combineReducers<StoreState, StoreActions>({
	weapons: weaponsReducer,
	currentWeapon: currentWeaponReducer,
});

export type Store = Rodux.Store<StoreState, StoreActions>;
