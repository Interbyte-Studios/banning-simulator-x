import Rodux from "@rbxts/rodux";

import { ClubRewardsActions, clubRewardsReducer, ClubRewardsState, defaultClubRewardsState } from "./clubRewards";
import { defaultEggIndexState, eggIndexReducer, EggIndexState } from "./eggs";
import {
	defaultGameVersionsPlayedState,
	GameVersionsPlayedActions,
	gameVersionsPlayedReducer,
	GameVersionsPlayedState,
} from "./gameVersionsPlayed";
import { defaultGroupRankState, GroupRankActions, groupRankReducer, GroupRankState } from "./groupRank";
import { defaultGroupRewardsState, GroupRewardsActions, groupRewardsReducer, GroupRewardsState } from "./groupRewards";
import { defaultJoinDateState, JoinDateActions, joinDateReducer, JoinDateState } from "./joinDate";
import { defaultPetIndexReducerState, petIndexReducer, PetIndexState } from "./pets";
import { defaultTimePlayedState, TimePlayedActions, timePlayedReducer, TimePlayedState } from "./timePlayed";
import { defaultVipRewardsState, VipRewardsActions, vipRewardsReducer, VipRewardsState } from "./vipRewards";

export interface PlayerIndexState {
	pets: PetIndexState;
	eggs: EggIndexState;
	timePlayed: TimePlayedState;
	gameVersionsPlayed: GameVersionsPlayedState;
	groupRank: GroupRankState;
	groupRewards: GroupRewardsState;
	clubRewards: ClubRewardsState;
	vipRewards: VipRewardsState;
	joinDate: JoinDateState;
}

export type PlayerIndexActions =
	| TimePlayedActions
	| GroupRankActions
	| GroupRewardsActions
	| ClubRewardsActions
	| VipRewardsActions
	| JoinDateActions
	| GameVersionsPlayedActions;

export const defaultPlayerIndexState: PlayerIndexState = {
	pets: defaultPetIndexReducerState,
	eggs: defaultEggIndexState,
	timePlayed: defaultTimePlayedState,
	clubRewards: defaultClubRewardsState,
	gameVersionsPlayed: defaultGameVersionsPlayedState,
	groupRank: defaultGroupRankState,
	groupRewards: defaultGroupRewardsState,
	joinDate: defaultJoinDateState,
	vipRewards: defaultVipRewardsState,
};

export const playerIndexReducer = Rodux.combineReducers({
	pets: petIndexReducer,
	eggs: eggIndexReducer,
	timePlayed: timePlayedReducer,
	gameVersionsPlayed: gameVersionsPlayedReducer,
	groupRank: groupRankReducer,
	groupRewards: groupRewardsReducer,
	clubRewards: clubRewardsReducer,
	vipRewards: vipRewardsReducer,
	joinDate: joinDateReducer,
});
