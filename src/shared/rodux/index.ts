import Rodux from "@rbxts/rodux";

import { BoostActions, boostsReducer, BoostsState } from "./boosts";
import { CurrenciesActions, currenciesReducer, CurrenciesState } from "./currencies";
import { currentTalismanReducer, CurrentTalismanState } from "./currentTalisman";
import { CurrentWeaponActions, currentWeaponReducer, CurrentWeaponState } from "./currentWeapon";
import { experienceReducer, ExperienceState } from "./experience";
import { GamepassActions, gamepassesReducer, GamepassesState } from "./gamepasses";
import { PetsActions, petsReducer, PetsState } from "./pets";
import { QuestsAction, questsReducer, QuestsState } from "./quests";
import { SettingsActions, settingsReducer, SettingsState } from "./settings";
import { TalismanActions, talismanReducer, TalismansState } from "./talismans";
import { TitleActions, titleReducer, TitleState } from "./title";
import { WeaponsActions, weaponsReducer, WeaponsState } from "./weapons";
import { WorldActions, worldsReducer, WorldsState } from "./worlds";

export type StoreState = {
	boosts: BoostsState;
	currencies: CurrenciesState;
	currentWeapon: CurrentWeaponState;
	experience: ExperienceState;
	gamepasses: GamepassesState;
	pets: PetsState;
	quests: QuestsState;
	settings: SettingsState;
	title: TitleState;
	weapons: WeaponsState;
	worlds: WorldsState;
	talismans: TalismansState;
	currentTalisman: CurrentTalismanState;
};
export type StoreActions = (
	| BoostActions
	| CurrenciesActions
	| CurrentWeaponActions
	| GamepassActions
	| PetsActions
	| QuestsAction
	| SettingsActions
	| TitleActions
	| WeaponsActions
	| WorldActions
	| TalismanActions
) &
	Rodux.AnyAction;

export const storeReducer = Rodux.combineReducers<StoreState, StoreActions>({
	boosts: boostsReducer,
	currencies: currenciesReducer,
	currentWeapon: currentWeaponReducer,
	experience: experienceReducer,
	gamepasses: gamepassesReducer,
	pets: petsReducer,
	quests: questsReducer,
	settings: settingsReducer,
	title: titleReducer,
	weapons: weaponsReducer,
	worlds: worldsReducer,
	talismans: talismanReducer,
	currentTalisman: currentTalismanReducer,
});

export type Store = Rodux.Store<StoreState, StoreActions>;
