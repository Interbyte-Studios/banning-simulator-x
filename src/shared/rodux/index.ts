import Rodux from "@rbxts/rodux";

import { BoostActions, boostsReducer, BoostsState } from "./boosts";
import { CurrenciesActions, currenciesReducer, CurrenciesState } from "./currencies";
import { CurrentTalismanActions, currentTalismanReducer, CurrentTalismanState } from "./currentTalisman";
import { CurrentWeaponActions, currentWeaponReducer, CurrentWeaponState } from "./currentWeapon";
import { experienceReducer, ExperienceState } from "./experience";
import { GamepassActions, gamepassesReducer, GamepassesState } from "./gamepasses";
import { MediaActions, mediaReducer, MediaState } from "./media";
import { PetMasteryActions, petMasteryReducer, PetMasteryState } from "./petMastery";
import { PetsActions, petsReducer, PetsState } from "./pets";
import { playerIndexReducer, PlayerIndexState } from "./playerIndex";
import { QuestsAction, questsReducer, QuestsState } from "./quests";
import { RankActions, rankReducer, RankState } from "./rank";
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
	media: MediaState;
	pets: PetsState;
	quests: QuestsState;
	rank: RankState;
	settings: SettingsState;
	title: TitleState;
	weapons: WeaponsState;
	worlds: WorldsState;
	talismans: TalismansState;
	currentTalisman: CurrentTalismanState;
	index: PlayerIndexState;
	petMastery: PetMasteryState;
};
export type StoreActions = (
	| BoostActions
	| CurrenciesActions
	| CurrentWeaponActions
	| GamepassActions
	| MediaActions
	| PetsActions
	| QuestsAction
	| RankActions
	| SettingsActions
	| TitleActions
	| WeaponsActions
	| WorldActions
	| TalismanActions
	| CurrentTalismanActions
	| PetMasteryActions
) &
	Rodux.AnyAction;

export const storeReducer = Rodux.combineReducers<StoreState, StoreActions>({
	boosts: boostsReducer,
	currencies: currenciesReducer,
	currentWeapon: currentWeaponReducer,
	experience: experienceReducer,
	gamepasses: gamepassesReducer,
	media: mediaReducer,
	pets: petsReducer,
	quests: questsReducer,
	settings: settingsReducer,
	rank: rankReducer,
	title: titleReducer,
	weapons: weaponsReducer,
	worlds: worldsReducer,
	talismans: talismanReducer,
	currentTalisman: currentTalismanReducer,
	index: playerIndexReducer,
	petMastery: petMasteryReducer,
});

export type Store = Rodux.Store<StoreState, StoreActions>;
