import Rodux from "@rbxts/rodux";

import { CurrenciesActions, currenciesReducer, CurrenciesState } from "./currencies";
import { CurrentWeaponActions, currentWeaponReducer, CurrentWeaponState } from "./currentWeapon";
import { experienceReducer, ExperienceState } from "./experience";
import { WeaponsActions, weaponsReducer, WeaponsState } from "./weapons";

export type StoreState = {
	currencies: CurrenciesState;
	currentWeapon: CurrentWeaponState;
	experience: ExperienceState;
	weapons: WeaponsState;
};
export type StoreActions = (CurrentWeaponActions | WeaponsActions | CurrenciesActions) & Rodux.AnyAction;

export const storeReducer = Rodux.combineReducers<StoreState, StoreActions>({
	currencies: currenciesReducer,
	currentWeapon: currentWeaponReducer,
	experience: experienceReducer,
	weapons: weaponsReducer,
});

export type Store = Rodux.Store<StoreState, StoreActions>;
