import Rodux from "@rbxts/rodux";

import { AccoladeActions, accoladeReducer, AccoladeState } from "./accolade";
import { BansActions, bansReducer, BansState } from "./bans";
import { BoostActions, boostsReducer, BoostsState } from "./boosts";
import { CurrenciesActions, currenciesReducer, CurrenciesState } from "./currencies";
import { CurrentTalismanActions, currentTalismanReducer, CurrentTalismanState } from "./currentTalisman";
import { CurrentWeaponActions, currentWeaponReducer, CurrentWeaponState } from "./currentWeapon";
import { DailyRewardsActions, dailyRewardsReducer, DailyRewardsState } from "./dailyRewards";
import { dataVersionReducer, DataVersionState } from "./dataVersion";
import { DevProductActions, devProductReducer, DevProductState } from "./devProducts";
import { EggsActions, eggsReducer, EggsState } from "./eggs";
import { ExperienceActions, experienceReducer, ExperienceState } from "./experience";
import { GamepassActions, gamepassesReducer, GamepassesState } from "./gamepasses";
import { GamepassGiftsActions, gamepassGiftsReducer, GamepassGiftsState } from "./gamepassGifts";
import { InvitedFriendActions, invitedFriendReducer, InvitedFriendState } from "./invitedFriend";
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
import { TimeTrialsActions, timeTrialsReducer, TimeTrialsState } from "./timeTrials";
import { TitleActions, titleReducer, TitleState } from "./title";
import { TradeLogActions, tradeLogsReducer, TradeLogsState } from "./tradeLogs";
import { WeaponsActions, weaponsReducer, WeaponsState } from "./weapons";
import { WorldPrestigeActions, worldPrestigeReducer, WorldPrestigeState } from "./worldPrestige";
import { WorldActions, worldsReducer, WorldsState } from "./worlds";

export type StoreState = {
	accolades: AccoladeState;
	bans: BansState;
	boosts: BoostsState;
	currencies: CurrenciesState;
	currentWeapon: CurrentWeaponState;
	currentTalisman: CurrentTalismanState;
	dailyRewards: DailyRewardsState;
	devProducts: DevProductState;
	eggs: EggsState;
	experience: ExperienceState;
	gamepasses: GamepassesState;
	gamepassGifts: GamepassGiftsState;
	index: PlayerIndexState;
	invitedFriend: InvitedFriendState;
	media: MediaState;
	pets: PetsState;
	petMastery: PetMasteryState;
	petTeams: PetTeamsState;
	quests: QuestsState;
	rank: RankState;
	settings: SettingsState;
	spinWheel: SpinWheelState;
	talismans: TalismansState;
	timeTrials: TimeTrialsState;
	title: TitleState;
	tradeLogs: TradeLogsState;
	weapons: WeaponsState;
	worlds: WorldsState;
	dataVersion: DataVersionState;
	worldPrestige: WorldPrestigeState;
};

export type StoreActions = (
	| AccoladeActions
	| BansActions
	| BoostActions
	| CurrenciesActions
	| CurrentWeaponActions
	| DailyRewardsActions
	| EggsActions
	| ExperienceActions
	| GamepassActions
	| GamepassGiftsActions
	| MediaActions
	| PetsActions
	| QuestsAction
	| RankActions
	| SettingsActions
	| TitleActions
	| TimeTrialsActions
	| WeaponsActions
	| WorldActions
	| WorldPrestigeActions
	| TalismanActions
	| CurrentTalismanActions
	| PetMasteryActions
	| SpinWheelActions
	| PetTeamsActions
	| PlayerIndexActions
	| DevProductActions
	| TradeLogActions
	| InvitedFriendActions
) &
	Rodux.AnyAction;

export const storeReducer = Rodux.combineReducers<StoreState, StoreActions>({
	accolades: accoladeReducer,
	bans: bansReducer,
	boosts: boostsReducer,
	currencies: currenciesReducer,
	currentWeapon: currentWeaponReducer,
	dailyRewards: dailyRewardsReducer,
	eggs: eggsReducer,
	experience: experienceReducer,
	gamepasses: gamepassesReducer,
	gamepassGifts: gamepassGiftsReducer,
	media: mediaReducer,
	pets: petsReducer,
	quests: questsReducer,
	settings: settingsReducer,
	rank: rankReducer,
	title: titleReducer,
	timeTrials: timeTrialsReducer,
	weapons: weaponsReducer,
	worlds: worldsReducer,
	worldPrestige: worldPrestigeReducer,
	talismans: talismanReducer,
	currentTalisman: currentTalismanReducer,
	index: playerIndexReducer,
	invitedFriend: invitedFriendReducer,
	petMastery: petMasteryReducer,
	spinWheel: spinWheelReducer,
	petTeams: petTeamsReducer,
	devProducts: devProductReducer,
	tradeLogs: tradeLogsReducer,
	dataVersion: dataVersionReducer,
});

export type Store = Rodux.Store<StoreState, StoreActions>;
