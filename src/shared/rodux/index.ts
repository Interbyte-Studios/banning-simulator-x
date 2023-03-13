import Rodux from "@rbxts/rodux";

import { AccoladeActions, accoladeReducer, AccoladeState } from "./accolade";
import { bansReducer, BansState } from "./bans";
import { BoostActions, boostsReducer, BoostsState } from "./boosts";
import { CurrenciesActions, currenciesReducer, CurrenciesState } from "./currencies";
import { CurrentTalismanActions, currentTalismanReducer, CurrentTalismanState } from "./currentTalisman";
import { CurrentWeaponActions, currentWeaponReducer, CurrentWeaponState } from "./currentWeapon";
import { DevProductActions, devProductReducer, DevProductState } from "./devProducts";
import { EggsActions, eggsReducer, EggsState } from "./eggs";
import { experienceReducer, ExperienceState } from "./experience";
import { GamepassActions, gamepassesReducer, GamepassesState } from "./gamepasses";
import { MediaActions, mediaReducer, MediaState } from "./media";
import { PetMasteryActions, petMasteryReducer, PetMasteryState } from "./petMastery";
import { PetsActions, petsReducer, PetsState } from "./pets";
import { PetTeamsActions, petTeamsReducer, PetTeamsState } from "./petTeams";
import { PlayerIndexActions, playerIndexReducer, PlayerIndexState } from "./playerIndex";
import { QuestsAction, questsReducer, QuestsState } from "./quests";
import { RankActions, rankReducer, RankState } from "./rank";
import { SettingsActions, settingsReducer, SettingsState } from "./settings";
import { SpinWheelActions, spinWheelReducer, SpinWheelState } from "./spinWheel";
import { TalismanActions, talismanReducer, TalismansState } from "./talismans";
import { TitleActions, titleReducer, TitleState } from "./title";
import { WeaponsActions, weaponsReducer, WeaponsState } from "./weapons";
import { WorldActions, worldsReducer, WorldsState } from "./worlds";

export type StoreState = {
	accolades: AccoladeState;
	bans: BansState;
	boosts: BoostsState;
	currencies: CurrenciesState;
	currentWeapon: CurrentWeaponState;
	eggs: EggsState;
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
	spinWheel: SpinWheelState;
	petTeams: PetTeamsState;
	devProducts: DevProductState;
};
export type StoreActions = (
	| AccoladeActions
	| BoostActions
	| CurrenciesActions
	| CurrentWeaponActions
	| EggsActions
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
	| SpinWheelActions
	| PetTeamsActions
	| PlayerIndexActions
	| DevProductActions
) &
	Rodux.AnyAction;

export const storeReducer = Rodux.combineReducers<StoreState, StoreActions>({
	accolades: accoladeReducer,
	bans: bansReducer,
	boosts: boostsReducer,
	currencies: currenciesReducer,
	currentWeapon: currentWeaponReducer,
	eggs: eggsReducer,
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
	spinWheel: spinWheelReducer,
	petTeams: petTeamsReducer,
	devProducts: devProductReducer,
});

export type Store = Rodux.Store<StoreState, StoreActions>;
