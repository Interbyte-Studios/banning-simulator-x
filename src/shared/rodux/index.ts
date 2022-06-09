import Rodux from "@rbxts/rodux";

import { CurrenciesActions, currenciesReducer, CurrenciesState } from "./currencies";
import { CurrentWeaponActions, currentWeaponReducer, CurrentWeaponState } from "./currentWeapon";
import { experienceReducer, ExperienceState } from "./experience";
import { PetsActions, petsReducer, PetsState } from "./pets";
import { WeaponsActions, weaponsReducer, WeaponsState } from "./weapons";
import { WorldActions, worldsReducer, WorldsState } from "./worlds";

export type StoreState = {
	currencies: CurrenciesState;
	currentWeapon: CurrentWeaponState;
	experience: ExperienceState;
	pets: PetsState;
	weapons: WeaponsState;
	worlds: WorldsState;
};
export type StoreActions = (CurrentWeaponActions | WeaponsActions | CurrenciesActions | PetsActions | WorldActions) &
	Rodux.AnyAction;

export const storeReducer = Rodux.combineReducers<StoreState, StoreActions>({
	currencies: currenciesReducer,
	currentWeapon: currentWeaponReducer,
	experience: experienceReducer,
	pets: petsReducer,
	weapons: weaponsReducer,
	worlds: worldsReducer,
});

export type Store = Rodux.Store<StoreState, StoreActions>;
