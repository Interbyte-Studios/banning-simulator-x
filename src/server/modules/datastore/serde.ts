import { StoreState } from "shared/rodux";
import { defaultAccoladeState } from "shared/rodux/accolade";
import { defaultBansState } from "shared/rodux/bans";
import { defaultBoosts } from "shared/rodux/boosts";
import { defaultCurrencies } from "shared/rodux/currencies";
import { defaultTalismanId } from "shared/rodux/currentTalisman";
import { defaultCurrentWeaponState } from "shared/rodux/currentWeapon";
import { defaultDevProductState } from "shared/rodux/devProducts";
import { defaultEggs } from "shared/rodux/eggs";
import { defaultExperienceState } from "shared/rodux/experience";
import { defaultGamepasses } from "shared/rodux/gamepasses";
import { defaultInvitedFriendState } from "shared/rodux/invitedFriend";
import { defaultMediaState } from "shared/rodux/media";
import { defaultPetMasteryState } from "shared/rodux/petMastery";
import { defaultPets } from "shared/rodux/pets";
import { defaultPetTeamsState } from "shared/rodux/petTeams";
import { defaultPlayerIndex } from "shared/rodux/playerIndex";
import { defaultQuestsState } from "shared/rodux/quests";
import { defaultRank } from "shared/rodux/rank";
import { defaultSettings } from "shared/rodux/settings";
import { defaultSpinWheel } from "shared/rodux/spinWheel";
import { defaultTalismans } from "shared/rodux/talismans";
import { SerializedTradeLogState } from "shared/rodux/tradeLogs";
import { defaultWeaponsState } from "shared/rodux/weapons";
import { defaultWorlds } from "shared/rodux/worlds";
import { Modify } from "shared/util/modify";

export type ProfileState = Modify<
	StoreState,
	{
		index: Modify<
			StoreState["index"],
			{
				joinDate: number;
			}
		>;
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
	devProducts: defaultDevProductState,
	eggs: defaultEggs,
	experience: defaultExperienceState,
	gamepasses: defaultGamepasses,
	index: {
		...defaultPlayerIndex,
		joinDate: DateTime.now().UnixTimestampMillis,
	},
	media: defaultMediaState,
	pets: defaultPets,
	petMastery: defaultPetMasteryState,
	petTeams: defaultPetTeamsState,
	quests: defaultQuestsState,
	rank: defaultRank,
	settings: defaultSettings,
	spinWheel: defaultSpinWheel,
	talismans: defaultTalismans,
	title: undefined,
	tradeLogs: [],
	weapons: defaultWeaponsState,
	worlds: defaultWorlds,
	invitedFriend: defaultInvitedFriendState,
};

/**
 * Serializes a Rodux store state to be saved in a DataStore.
 *
 * @param store The store to serialize.
 * @returns The serialized store, ready to be saved in a DataStore.
 */
export function serialize(store: StoreState): ProfileState {
	return {
		...store,
		index: {
			...store.index,
			joinDate: store.index.joinDate.UnixTimestampMillis,
		},
		tradeLogs: store.tradeLogs.map((log) => {
			return {
				...log,
				timestamp: log.timestamp.UnixTimestampMillis,
			};
		}),
	};
}

/**
 * Deserializes a profile state into a Rodux store state.
 *
 * @param state The state to deserialize.
 * @returns The reconstructed Rodux state.
 */
export function deserialize(state: ProfileState): StoreState {
	return {
		...state,
		index: {
			...state.index,
			joinDate: DateTime.fromUnixTimestampMillis(state.index.joinDate),
		},
		tradeLogs: state.tradeLogs.map((log) => {
			return {
				...log,
				timestamp: DateTime.fromUnixTimestampMillis(log.timestamp),
			};
		}),
	};
}
