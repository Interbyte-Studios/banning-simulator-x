import Rodux from "@rbxts/rodux";

import { AurasActions, aurasReducer, AurasState } from "./auras";
import { currenciesReducer, CurrenciesState } from "./currencies";
import { CurrentAuraActions, currentAuraReducer, CurrentAuraState } from "./currentAura";
import { CurrentWeaponActions, currentWeaponReducer, CurrentWeaponState } from "./currentWeapon";
import { WeaponsActions, weaponsReducer, WeaponsState } from "./weapons";

export type StoreState = {
	auras: AurasState;
	currencies: CurrenciesState;
	currentAura: CurrentAuraState;
	currentWeapon: CurrentWeaponState;
	weapons: WeaponsState;
};
export type StoreActions = (AurasActions | CurrentAuraActions | CurrentWeaponActions | WeaponsActions) &
	Rodux.AnyAction;

export const storeReducer = Rodux.combineReducers<StoreState, StoreActions>({
	auras: aurasReducer,
	currencies: currenciesReducer,
	currentAura: currentAuraReducer,
	currentWeapon: currentWeaponReducer,
	weapons: weaponsReducer,
});

export type Store = Rodux.Store<StoreState, StoreActions>;
