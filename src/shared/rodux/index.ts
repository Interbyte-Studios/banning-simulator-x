import Rodux from "@rbxts/rodux";

import { currenciesReducer, CurrenciesState } from "./currencies";
import { CurrentWeaponActions, currentWeaponReducer, CurrentWeaponState } from "./currentWeapon";
import { WeaponsActions, weaponsReducer, WeaponsState } from "./weapons";

export type StoreState = {
	currencies: CurrenciesState;
	currentWeapon: CurrentWeaponState;
	weapons: WeaponsState;
};
export type StoreActions = (CurrentWeaponActions | WeaponsActions) & Rodux.AnyAction;

export const storeReducer = Rodux.combineReducers<StoreState, StoreActions>({
	currencies: currenciesReducer,
	currentWeapon: currentWeaponReducer,
	weapons: weaponsReducer,
});

export type Store = Rodux.Store<StoreState, StoreActions>;
