import { StoreState } from "shared/rodux";
import { defaultAccoladeState } from "shared/rodux/accolade";
import { defaultBansState } from "shared/rodux/bans";
import { defaultBoosts, SerializedBoostsState } from "shared/rodux/boosts";
import { defaultCurrencies } from "shared/rodux/currencies";
import { defaultTalismanId } from "shared/rodux/currentTalisman";
import { defaultCurrentWeaponState } from "shared/rodux/currentWeapon";
import { defaultDailyRewards } from "shared/rodux/dailyRewards";
import { defaultDevProductState } from "shared/rodux/devProducts";
import { defaultEggs } from "shared/rodux/eggs";
import { defaultExperienceState } from "shared/rodux/experience";
import { defaultGamepasses } from "shared/rodux/gamepasses";
import { defaultGamepassGifts } from "shared/rodux/gamepassGifts";
import { defaultInvitedFriendState } from "shared/rodux/invitedFriend";
import { defaultMediaState } from "shared/rodux/media";
import { SerializedPetMasteryState } from "shared/rodux/petMastery";
import { defaultPetQuestState } from "shared/rodux/petQuest";
import { defaultPets } from "shared/rodux/pets";
import { defaultPetTeamsState } from "shared/rodux/petTeams";
import { defaultPlayerIndexState } from "shared/rodux/playerIndex";
import { SerializedPetIndexState } from "shared/rodux/playerIndex/pets";
import { defaultQuestsState } from "shared/rodux/quests";
import { defaultRank } from "shared/rodux/rank";
import { defaultSettings } from "shared/rodux/settings";
import { defaultSpinWheel } from "shared/rodux/spinWheel";
import { defaultTalismans } from "shared/rodux/talismans";
import { defaultTimeTrialsState } from "shared/rodux/timeTrials";
import { SerializedTradeLogState } from "shared/rodux/tradeLogs";
import { defaultWeaponsState } from "shared/rodux/weapons";
import { defaultWorldPrestigeState } from "shared/rodux/worldPrestige";
import { defaultWorlds } from "shared/rodux/worlds";
import { Modify } from "shared/util/modify";

import { getServerDataVersion } from "./migrations";

export type ProfileState = Modify<
	StoreState,
	{
		boosts: SerializedBoostsState;
		index: Modify<
			StoreState["index"],
			{
				clubRewards: Modify<
					StoreState["index"]["clubRewards"],
					{
						lastClaimed: number;
					}
				>;
				groupRewards: Modify<
					StoreState["index"]["groupRewards"],
					{
						lastClaimed: number;
					}
				>;
				joinDate: number;
				pets: SerializedPetIndexState;
				vipRewards: Modify<
					StoreState["index"]["vipRewards"],
					{
						lastClaimed: number;
					}
				>;
			}
		>;
		petMastery: SerializedPetMasteryState;
		tradeLogs: SerializedTradeLogState;
	}
>;

/**
 * Profile template matches the store state template.
 */
export const profileTemplate: ProfileState = {
	accolades: defaultAccoladeState,
	bans: defaultBansState,
	boosts: defaultBoosts,
	currencies: defaultCurrencies,
	currentWeapon: defaultCurrentWeaponState,
	currentTalisman: defaultTalismanId,
	dailyRewards: defaultDailyRewards,
	devProducts: defaultDevProductState,
	eggs: defaultEggs,
	experience: defaultExperienceState,
	gamepasses: defaultGamepasses,
	gamepassGifts: defaultGamepassGifts,
	index: {
		...defaultPlayerIndexState,
		clubRewards: {
			...defaultPlayerIndexState["clubRewards"],
			lastClaimed: 0,
		},
		groupRewards: {
			...defaultPlayerIndexState["groupRewards"],
			lastClaimed: 0,
		},
		pets: [],
		joinDate: DateTime.now().UnixTimestampMillis,
		vipRewards: {
			...defaultPlayerIndexState["vipRewards"],
			lastClaimed: 0,
		},
	},
	media: defaultMediaState,
	pets: defaultPets,
	petQuests: defaultPetQuestState,
	petMastery: [],
	petTeams: defaultPetTeamsState,
	quests: defaultQuestsState,
	rank: defaultRank,
	settings: defaultSettings,
	spinWheel: defaultSpinWheel,
	talismans: defaultTalismans,
	timeTrials: defaultTimeTrialsState,
	title: undefined,
	tradeLogs: [],
	weapons: defaultWeaponsState,
	worlds: defaultWorlds,
	dataVersion: getServerDataVersion(),
	invitedFriend: defaultInvitedFriendState,
	worldPrestige: defaultWorldPrestigeState,
};
